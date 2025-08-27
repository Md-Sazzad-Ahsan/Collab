// subscriptionScheduler.js
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const Subscription = require('./models/Subscription');
const Logger = require('./Logger');
const log = new Logger('Server');

// Redis connection
const connection = new IORedis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
});

// Create the queue
const subscriptionQueue = new Queue('subscription-expiry', { connection });

// Worker to process subscription expiry jobs
const worker = new Worker(
    'subscription-expiry',
    async (job) => {
        const { subscriptionId } = job.data;

        const subscription = await Subscription.findById(subscriptionId).populate('user');
        if (!subscription) return;

        const user = subscription.user;
        if (user) {
            user.is_premium = false;
            await user.save();
            log.log(`User ${user.email} premium expired.`);
        }

        await Subscription.findByIdAndDelete(subscriptionId);
        log.log(`Deleted subscription for user ${user.email}`);
    },
    { connection },
);

worker.on('completed', (job) => log.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => log.error(`Job ${job.id} failed: ${err.message}`));

// Schedule a subscription expiry
async function scheduleSubscription(subscription) {
    const now = new Date();
    const delay = new Date(subscription.endDate) - now;

    if (delay <= 0) {
        await subscriptionQueue.add('expire', { subscriptionId: subscription._id }, { delay: 1 });
    } else {
        await subscriptionQueue.add('expire', { subscriptionId: subscription._id }, { delay });
    }

    log.log(`Scheduled subscription expiry for user ${subscription.user} at ${subscription.endDate}`);
}

// Initialize scheduler on startup
async function initScheduler() {
    try {
        const activeSubs = await Subscription.find({ status: 'active' });
        for (const sub of activeSubs) {
            await scheduleSubscription(sub);
        }
        log.log(
            `%cLoaded and scheduled ${activeSubs.length} active subscriptions.`,
            'font-family:monospace; color: green; font-size: 16px',
        );
    } catch (err) {
        log.error('Error initializing subscription scheduler:', err);
    }
}

module.exports = {
    subscriptionQueue,
    scheduleSubscription,
    initScheduler,
};
