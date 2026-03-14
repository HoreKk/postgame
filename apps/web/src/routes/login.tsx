import { createFileRoute, Link, redirect } from "@tanstack/react-router";
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
import { SignInIcon, WarningIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { Field } from "../components/ui/field";
import z from "zod";
import { PasswordInput } from "@/components/ui/password-input";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    if (context.session) throw redirect({ to: "/" });
  },
  component: LoginPage,
});

const loginForm = z.object({
  email: z.email("Enter a valid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" } as z.infer<typeof loginForm>,
    validators: {
      onChange: () => setServerError(null),
      onSubmit: loginForm,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
        callbackURL: "/",
      });
      if (error) {
        setServerError(error.message ?? "Invalid credentials. Try again.");
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
                Welcome back.
              </Fieldset.Legend>
              <Fieldset.HelperText fontSize="xs" color="fg.muted">
                Enter your credentials to access the platform
              </Fieldset.HelperText>
              <Fieldset.Content>
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
                        placeholder="Enter your password"
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
                      <Alert.Title> {serverError}</Alert.Title>
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
                      Sign In
                      <Icon asChild>
                        <SignInIcon />
                      </Icon>
                    </Button>
                  )}
                </form.Subscribe>
              </Fieldset.Content>
            </Fieldset.Root>
          </form>
          <Separator my={6} />
          <Text fontSize="xs" color="fg.muted" textAlign="center">
            No account?{" "}
            <ChakraLink colorPalette="primary" outline="none" asChild>
              <Link to="/signup">
                <Text as="span" fontWeight="bold">
                  Sign Up
                </Text>
              </Link>
            </ChakraLink>
          </Text>
        </Box>
      </GridItem>
    </Grid>
  );
}
