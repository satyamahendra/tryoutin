export const examOptionInitialValues = {
    option_text: "",
    option_image: null,
    score: null,
    is_correct: null,
    order_index: null,
}

export const examQuestionInitialValues = {
    type: null,
    question_text: "",
    question_image: null,
    explanation: null,
    explanation_image: null,
    order_index: null,
    options: [examOptionInitialValues],
}

export const examPartInitialValues = {
    name: "",
    order_index: null,
    passing_score: 0,
    duration_minutes: null,
    questions: [examQuestionInitialValues],
}

export const examInitialValues = {
    id: "",
    title: "",
    description: null,
    category: "",
    duration_minutes: null,
    product_id: null,
    tags: [],
    parts: [examPartInitialValues],
}
