from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import torch

base_model = AutoModelForCausalLM.from_pretrained("EleutherAI/gpt-neo-125M")
model = PeftModel.from_pretrained(base_model, "./bangla_chat_model")

tokenizer = AutoTokenizer.from_pretrained("./bangla_chat_model")
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

while True:
    prompt = input("Bangla prompt (or 'exit'): ")
    if prompt.lower() == "exit":
        break

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_length=20,
        do_sample=True,
        temperature=0.8,
        pad_token_id=tokenizer.eos_token_id
    )

    print(tokenizer.decode(outputs[0], skip_special_tokens=True))
