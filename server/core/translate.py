from googletrans import LANGUAGES, Translator
import json

translator = Translator()
text = "가수"
# languages_dict = {
#     lang_code: lang_name.capitalize()for lang_code, lang_name in LANGUAGES.items()}
# languages_json = json.dumps(languages_dict, ensure_ascii=False, indent=4)

# # Write the JSON data to a file
# with open('ver1\src\languages.json', 'w', encoding='utf-8') as json_file:
#     json_file.write(languages_json)

# print(languages_json)
sr = translator.detect(text=text).lang
language_name = LANGUAGES.get(sr, "Unknown language")

print(f"Detected language: {language_name}")
translations = translator.translate(text=text, src=sr, dest='en').text
print(translations)