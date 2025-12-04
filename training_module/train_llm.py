from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, Trainer, TrainingArguments, DataCollatorForSeq2Seq
from peft import LoraConfig, get_peft_model, TaskType

model_name = "EleutherAI/gpt-neo-125M"
hf_token = "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"

tokenizer = AutoTokenizer.from_pretrained(model_name, token=hf_token)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(model_name, token=hf_token)

lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.1,
    task_type=TaskType.CAUSAL_LM
)

model = get_peft_model(model, lora_config)

dataset = load_dataset("md-nishat-008/Bangla-Instruct", split="train").select(range(500))

def preprocess(example):
    prompt = example.get("instruction", "")
    if example.get("input"):
        prompt += "\n" + example["input"]
    target = example.get("output", "")
    
    if not target.strip():
        target = " " 
    
    inputs = tokenizer(prompt, truncation=True, max_length=128)
    labels = tokenizer(target, truncation=True, max_length=128)["input_ids"]

    labels = [l if l != tokenizer.pad_token_id else -100 for l in labels]

    if len(labels) < len(inputs["input_ids"]):
        labels += [-100] * (len(inputs["input_ids"]) - len(labels))
    elif len(labels) > len(inputs["input_ids"]):
        labels = labels[:len(inputs["input_ids"])]

    inputs["labels"] = labels
    return inputs

train_dataset = dataset.map(preprocess, batched=False)

data_collator = DataCollatorForSeq2Seq(tokenizer, pad_to_multiple_of=8, return_tensors="pt")

training_args = TrainingArguments(
    output_dir="./bangla_chat_model",
    per_device_train_batch_size=1,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    num_train_epochs=3,
    fp16=False,
    logging_steps=10,
    save_steps=50,
    save_total_limit=2,
)

trainer = Trainer(
    model=model,
    train_dataset=train_dataset,
    args=training_args,
    data_collator=data_collator,
)

trainer.train()

model.save_pretrained("./bangla_chat_model")
tokenizer.save_pretrained("./bangla_chat_model")
