import { redirect } from 'react-router-dom';
import { getUserById, updatePassword } from '../services/api';

export async function userSettingsLoader() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
        return redirect('/login');
    }

    try {
        const user = JSON.parse(userJson);
        console.log(user)
        const response = await getUserById(user.id);
        return response.data;
    } catch (error) {
        console.error('Error loading user data:', error);
        return null;
    }
}

export async function updatePasswordAction({ request }) {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
        return { error: 'User not authenticated' };
    }

    try {
        const user = JSON.parse(userJson);
        const formData = await request.formData();
        const passwordData = {
            newPassword: formData.get('newPassword'),
            securityAnswers: [
                formData.get('securityAnswer1'),
                formData.get('securityAnswer2')
            ]
        };

        await updatePassword(user.id, passwordData);
        return { success: 'Password updated successfully' };
    } catch (error) {
        console.error('Error updating password:', error);
        return {
            error: error.response?.data?.message || 'Failed to update password'
        };
    }
}
