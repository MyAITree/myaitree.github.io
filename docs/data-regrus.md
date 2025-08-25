Question extractor Regex:

^\*\*(?<number>\d+)\.\s+(?<question>.*?)\?\*\*\s*a\)\s*(?<option_a>.*?)\s*b\)\s*(?<option_b>.*?)\s*c\)\s*(?<option_c>.*?)\s*d\)\s*(?<option_d>.*?)(?=\n\*\*\d+\.|\n###|$)

Answer Extractor Regex:
(?<number>\d+)\.\s+(?<correct_option>[a-d])\)\s*(?<explanation>.*?)(?=\n\d+\.|\n###|\n---|$)/gs