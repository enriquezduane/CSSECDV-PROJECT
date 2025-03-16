import { useState, useEffect } from 'react';
import {
    Box,
    Title,
    Text,
    Paper,
    Divider,
    TextInput,
    PasswordInput,
    Button,
    Group,
    Stack,
    Alert
} from '@mantine/core';
import { Form, useLoaderData, useActionData, useSubmit } from 'react-router-dom';

function Settings() {
    const user = useLoaderData();
    const actionData = useActionData();
    const submit = useSubmit();
    const [formValues, setFormValues] = useState({
        currentPassword: '',
        securityAnswer1: '',
        securityAnswer2: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formValues.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formValues.securityAnswer1) {
            newErrors.securityAnswer1 = 'Security answer is required';
        }

        if (!formValues.securityAnswer2) {
            newErrors.securityAnswer2 = 'Security answer is required';
        }

        if (!formValues.newPassword || formValues.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        }

        if (formValues.newPassword !== formValues.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = new FormData(e.target);
            submit(formData, { method: 'post' });
        }
    };

    const resetForm = () => {
        setFormValues({
            currentPassword: '',
            securityAnswer1: '',
            securityAnswer2: '',
            newPassword: '',
            confirmNewPassword: '',
        });
        setErrors({});
    };

    // Reset form when success message is received
    if (actionData?.success && formValues.newPassword) {
        resetForm();
    }

    if (!user) {
        return <Text>User not found</Text>;
    }

    return (
        <Box p="md">
            <Title order={2} mb="md">Account Settings</Title>

            <Paper p="md" withBorder mb="xl">
                <Title order={3} mb="sm">Profile Information</Title>
                <Text size="lg" mb="xs"><strong>Username:</strong> {user.username}</Text>
                <Text size="lg" mb="xs"><strong>Role:</strong> {user.role}</Text>
                <Text size="lg" mb="xs"><strong>Last Login:</strong> {user.previousLogin || 'N/A'}</Text>
            </Paper>

            <Paper p="md" withBorder>
                <Title order={3} mb="sm">Change Password</Title>

                {actionData?.error && (
                    <Alert color="red" mb="md">
                        {actionData.error}
                    </Alert>
                )}

                {actionData?.success && (
                    <Alert color="green" mb="md">
                        {actionData.success}
                    </Alert>
                )}

                <Form method="post" onSubmit={handleSubmit}>
                    <Stack spacing="md">
                        <TextInput
                            label="Security Question 1"
                            description={user.securityQuestions?.[0]?.question || "No security question set"}
                            placeholder="Enter your answer"
                            required
                            name="securityAnswer1"
                            value={formValues.securityAnswer1}
                            onChange={handleChange}
                            error={errors.securityAnswer1}
                        />

                        <TextInput
                            label="Security Question 2"
                            description={user.securityQuestions?.[1]?.question || "No security question set"}
                            placeholder="Enter your answer"
                            required
                            name="securityAnswer2"
                            value={formValues.securityAnswer2}
                            onChange={handleChange}
                            error={errors.securityAnswer2}
                        />

                        <Divider my="sm" />

                        <PasswordInput
                            label="Current Password"
                            placeholder="Enter your current password"
                            required
                            name="currentPassword"
                            value={formValues.currentPassword}
                            onChange={handleChange}
                            error={errors.currentPassword}
                        />

                        <PasswordInput
                            label="New Password"
                            placeholder="Enter your new password"
                            required
                            name="newPassword"
                            value={formValues.newPassword}
                            onChange={handleChange}
                            error={errors.newPassword}
                        />

                        <PasswordInput
                            label="Confirm New Password"
                            placeholder="Confirm your new password"
                            required
                            name="confirmNewPassword"
                            value={formValues.confirmNewPassword}
                            onChange={handleChange}
                            error={errors.confirmNewPassword}
                        />

                        <Group position="right" mt="md">
                            <Button type="submit">Update Password</Button>
                        </Group>
                    </Stack>
                </Form>
            </Paper>
        </Box>
    );
}

export default Settings;
