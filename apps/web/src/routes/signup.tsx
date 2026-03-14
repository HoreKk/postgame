import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import {
  Box,
  Button,
  Fieldset,
  Grid,
  GridItem,
  Input,
  Separator,
  Text,
  Link as ChakraLink,
  Icon,
  Alert,
} from "@chakra-ui/react";
import { UserCirclePlusIcon, WarningIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { Field } from "../components/ui/field";
import z from "zod";
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";

export const Route = createFileRoute("/signup")({
  beforeLoad: async ({ context }) => {
    if (context.session) throw redirect({ to: "/" });
  },
  component: SignupPage,
});

const signupSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.email("Enter a valid email address").min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const strengthOptions = [
  { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
  { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
  { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
  { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 },
];

function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as z.infer<typeof signupSchema>,
    validators: {
      onChange: () => setServerError(null),
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await authClient.signUp.email({
        ...value,
        name: value.username,
        callbackURL: "/",
      });
      if (error) {
        setServerError(error.message ?? "Something went wrong. Please try again.");
      } else {
        navigate({ to: "/" });
      }
    },
  });

  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(12, 1fr)" }} minH="calc(100dvh - 49px)">
      <Box
        position="absolute"
        inset={0}
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,77,77,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,77,77,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        zIndex={-1}
        pointerEvents="none"
      />
      <GridItem
        colStart={{ base: 1, md: 4, lg: 5 }}
        colSpan={{ base: 0, md: 6, lg: 4 }}
        px={4}
        py={12}
        my="auto"
      >
        <Box h="2px" bgColor="primary.solid" borderRadius="full" />
        <Box p={8} zIndex={10} bgColor="bg.panel">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <Fieldset.Root invalid={!!serverError}>
              <Fieldset.Legend fontSize="2xl" fontWeight="700">
                Create an account.
              </Fieldset.Legend>
              <Fieldset.HelperText fontSize="xs" color="fg.muted">
                Fill in your details to get started
              </Fieldset.HelperText>
              <Fieldset.Content>
                <form.Field name="username">
                  {(field) => (
                    <Field
                      label="Username"
                      errorText={
                        field.state.meta.isTouched
                          ? field.state.meta.errors.map((err) => err?.message).join(", ")
                          : undefined
                      }
                      invalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                      w="full"
                    >
                      <Input
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="@john_doe"
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="email">
                  {(field) => (
                    <Field
                      label="Email Address"
                      errorText={
                        field.state.meta.isTouched
                          ? field.state.meta.errors.map((err) => err?.message).join(", ")
                          : undefined
                      }
                      invalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                      w="full"
                    >
                      <Input
                        type="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="password">
                  {(field) => (
                    <Field
                      label="Password"
                      errorText={
                        field.state.meta.isTouched
                          ? field.state.meta.errors.map((err) => err?.message).join(", ")
                          : undefined
                      }
                      invalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                      w="full"
                    >
                      <PasswordInput
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Create a password"
                      />
                      <PasswordStrengthMeter
                        w="full"
                        value={
                          strengthOptions.filter((option) => {
                            const hasMinLength = field.state.value.length >= option.minLength;
                            const hasMinDiversity =
                              new Set(field.state.value.split("")).size >= option.minDiversity;
                            return hasMinLength && hasMinDiversity;
                          }).length
                        }
                        mt={2}
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChangeListenTo: ["password"],
                    onChange: ({ value, fieldApi }) => {
                      if (value !== fieldApi.form.getFieldValue("password")) {
                        return { message: "Passwords do not match" };
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Field
                      label="Confirm Password"
                      errorText={
                        field.state.meta.isTouched
                          ? field.state.meta.errors.map((err) => err?.message).join(", ")
                          : undefined
                      }
                      invalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                      w="full"
                    >
                      <PasswordInput
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Repeat your password"
                      />
                    </Field>
                  )}
                </form.Field>
                {serverError && (
                  <Fieldset.ErrorText>
                    <Alert.Root status="error" alignItems="center">
                      <Icon color="primary.solid" asChild>
                        <WarningIcon weight="bold" />
                      </Icon>
                      <Alert.Title>{serverError}</Alert.Title>
                    </Alert.Root>
                  </Fieldset.ErrorText>
                )}
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting] as const}
                >
                  {([canSubmit, isSubmitting]) => (
                    <Button
                      type="submit"
                      disabled={!canSubmit || !!serverError}
                      loading={isSubmitting}
                      colorPalette="primary"
                      mt={2}
                    >
                      Create Account
                      <Icon asChild>
                        <UserCirclePlusIcon />
                      </Icon>
                    </Button>
                  )}
                </form.Subscribe>
              </Fieldset.Content>
            </Fieldset.Root>
          </form>
          <Separator my={6} />
          <Text fontSize="xs" color="fg.muted" textAlign="center">
            Already have an account?{" "}
            <ChakraLink colorPalette="primary" outline="none" asChild>
              <Link to="/login">
                <Text as="span" fontWeight="bold">
                  Sign In
                </Text>
              </Link>
            </ChakraLink>
          </Text>
        </Box>
      </GridItem>
    </Grid>
  );
}
