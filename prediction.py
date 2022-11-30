from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_size = "small"

tokenizer = AutoTokenizer.from_pretrained(f'microsoft/DialoGPT-{model_size}')
model = AutoModelForCausalLM.from_pretrained(f'output/output-{model_size}')


def predict_response(user_text):
    message = user_text
    new_user_input_ids = tokenizer.encode(message + tokenizer.eos_token, return_tensors='pt')
    # bot_input_ids = torch.cat([chat_history_ids, new_user_input_ids], dim=-1) if step > 0 else new_user_input_ids
    bot_input_ids = torch.cat([new_user_input_ids], dim=-1)
    chat_history_ids = model.generate(
                bot_input_ids,
                max_length=1000,
                pad_token_id=tokenizer.eos_token_id,
                no_repeat_ngram_size=3,
                do_sample=True,
                top_k=100,
                top_p=0.7,
                temperature=0.8)
    res = tokenizer.decode(chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)
    print("Res", res)
    return res

