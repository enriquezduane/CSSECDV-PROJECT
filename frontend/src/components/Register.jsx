import { useState } from 'react';
import {
    TextInput,
    PasswordInput,
    Select,
    Button,
    Title,
    Paper,
    Stack,
    Group,
    Container,
    Divider,
    Alert,
    Box,
} from '@mantine/core';
import { Form, useActionData, useNavigation } from 'react-router-dom';

const securityQuestionsList = [
    "What is your favorite color?",
    "What is your pet's name?",
    "What is the name of your first school?",
    "What is your mother's maiden name?",
    "What was the make and model of your first car?",
    "What city were you born in?",
    "What is your favorite food?",
];

function RegisterForm() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setPasswordsMatch(password === value);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordsMatch(confirmPassword === value);
    };

    return (
        <Container size="sm" my={40}>
            <Paper radius="md" p="xl" withBorder>
                <Title order={2} ta="center" mt="md" mb={30}>
                    Register New Manager
                </Title>

                {actionData?.error && (
                    <Alert title="Error" color="red" mb="lg">
                        {actionData.error}
                    </Alert>
                )}

                {actionData?.success && (
                    <Alert title="Success" color="green" mb="lg">
                        Manager registered successfully
                    </Alert>
                )}

                <Form method="post">
                    <input type="hidden" name="role" value="manager" />
                    <Stack>
                        <TextInput
                            required
                            label="Username"
                            name="username"
                            placeholder="Enter username"
                            defaultValue={actionData?.values?.username || ''}
                        />

                        <PasswordInput
                            required
                            label="Password"
                            name="password"
                            placeholder="Create password"
                            onChange={handlePasswordChange}
                            error={!passwordsMatch && confirmPassword !== '' && "Passwords don't match"}
                        />

                        <PasswordInput
                            required
                            label="Confirm Password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            onChange={handleConfirmPasswordChange}
                            error={!passwordsMatch && confirmPassword !== '' && "Passwords don't match"}
                        />

                        <Box>
                            <Divider label="Security Questions" labelPosition="center" my="md" />

                            <Group grow mb="md">
                                <Select
                                    label="Question 1"
                                    placeholder="Select a question"
                                    name="question1"
                                    data={securityQuestionsList.map(q => ({ value: q, label: q }))}
                                    required
                                />
                                <TextInput
                                    label="Answer"
                                    placeholder="Your answer"
                                    name="answer1"
                                    required
                                />
                            </Group>

                            <Group grow mb="md">
                                <Select
                                    label="Question 2"
                                    placeholder="Select a question"
                                    name="question2"
                                    data={securityQuestionsList.map(q => ({ value: q, label: q }))}
                                    required
                                />
                                <TextInput
                                    label="Answer"
                                    placeholder="Your answer"
                                    name="answer2"
                                    required
                                />
                            </Group>
                        </Box>

                        <Button
                            type="submit"
                            mt="xl"
                            loading={isSubmitting}
                            disabled={confirmPassword !== '' && !passwordsMatch}
                        >
                            Register Manager
                        </Button>
                    </Stack>
                </Form>
            </Paper>
        </Container>
    );
}

export default RegisterForm;
