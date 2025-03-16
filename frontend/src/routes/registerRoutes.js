import { createUser } from '../services/api'
import { redirect } from 'react-router-dom'
import { checkAuth } from '../utils/auth'

export const registerLoader = async () => {
    const user = await checkAuth()

    if (!user) {
        return redirect('/login')
    }

    if (user.role !== 'manager') {
        return redirect('/cashier')
    }

    return null
}

export const registerAction = async ({ request }) => {
    const formData = await request.formData()

    const userData = {
        username: formData.get('username'),
        password: formData.get('password'),
        role: formData.get('role')
    }

    // Handle security questions if provided
    const useSecurityQuestions = formData.get('useSecurityQuestions') === 'true'

    if (useSecurityQuestions) {
        userData.securityQuestions = [
            {
                question: formData.get('question1'),
                answerHash: formData.get('answer1')
            },
            {
                question: formData.get('question2'),
                answerHash: formData.get('answer2')
            }
        ]
    }

    try {
        await createUser(userData)
        return { success: true }
    } catch (error) {
        return {
            error: error.response?.data?.message || 'An error occurred during registration',
            values: userData
        }
    }
}
