import json
import random

# Load the JSON file
with open('ques.json', 'r') as file:
    data = json.load(file)

# Initialize a variable to store the total score
total_score = 0

# Loop through the three categories: "Logical Thinking," "Problem-Solving Skills," and "Attention to Detail"
for category, category_data in data.items():
    print(f"\nCategory: {category}\n")

    # Get a list of all question numbers in the current category
    question_numbers = list(category_data.keys())

    # Choose 5 random question numbers from each category
    selected_question_numbers = random.sample(question_numbers, 5)

    # Loop through the selected questions in the current category
    for question_number in selected_question_numbers:
        question_data = category_data[question_number]

        # Print the question
        print(question_data['question'])

        # Print the answer choices
        for choice, answer in question_data['answers'].items():
            print(f"{choice}: {answer}")

        # Get user input for the answer
        user_answer = input("Your answer (A/B/C/D): ")

        # Check if the user's answer is correct
        if user_answer.upper() == question_data['answer']:
            print("Correct!\n")
            total_score += 1
        else:
            print(f"Wrong! The correct answer is {question_data['answer']}\n")

# Print the total score
print(f"Your total score: {total_score}/20")
