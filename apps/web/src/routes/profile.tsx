import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import {
  Alert,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Separator,
  Text,
} from "@chakra-ui/react";
import {
  CalendarIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  FloppyDiskIcon,
  WarningIcon,
  WarningCircleIcon,
  UserSquareIcon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Field } from "@/components/ui/field";
import z from "zod";
import BaseContainer from "@/components/layouts/BaseContainer";

export const Route = createFileRoute("/profile")({
  beforeLoad: async ({ context }) => {
    if (!context.session) throw redirect({ to: "/login" });
  },
  component: ProfilePage,
});

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      align={{ base: "flex-start", md: "center" }}
      gap={{ base: 3, md: 6 }}
      py={5}
    >
      <Box flex="1" minW={0}>
        <Text fontSize="sm" fontWeight="medium">
          {label}
        </Text>
        {description && (
          <Text fontSize="xs" color="fg.muted" mt={0.5}>
            {description}
          </Text>
        )}
      </Box>
      <Box w={{ base: "full", md: "320px" }} flexShrink={0}>
        {children}
      </Box>
    </Flex>
  );
}

function ProfilePage() {
  const { session } = Route.useRouteContext();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const user = session!.user;

  const joinedDate = useMemo(
    () =>
      new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [user.createdAt],
  );

  const form = useForm({
    defaultValues: {
      name: user.name,
    } as z.infer<typeof profileSchema>,
    validators: {
      onChange: () => {
        setServerError(null);
        setSaved(false);
      },
      onSubmit: profileSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await authClient.updateUser({ name: value.name });
      if (error) {
        setServerError(error.message ?? "Something went wrong. Please try again.");
      } else {
        setSaved(true);
        router.invalidate();
      }
    },
  });

  return (
    <BaseContainer>
      <Flex align="center" gap={2}>
        <Icon size="2xl" color="primary.focusRing">
          <UserSquareIcon weight="fill" />
        </Icon>
        <Heading size="2xl">Profile</Heading>
      </Flex>
      <Separator mt={6} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <SettingRow
          label="Display Name"
          description="This is the name visible to others across the app."
        >
          <form.Field name="name">
            {(field) => (
              <Field
                errorText={
                  field.state.meta.isTouched
                    ? field.state.meta.errors.map((err) => err?.message).join(", ")
                    : undefined
                }
                invalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
              >
                <Input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Your display name"
                />
              </Field>
            )}
          </form.Field>
        </SettingRow>
        <Separator />
        <SettingRow label="Email Address" description="Used for login and notifications.">
          <Flex align="center" gap={2}>
            <Icon color="fg.subtle" asChild>
              <EnvelopeIcon />
            </Icon>
            <Text fontSize="sm" color="fg.muted" flex={1} truncate>
              {user.email}
            </Text>
            <Badge
              colorPalette={user.emailVerified ? "green" : "orange"}
              size="sm"
              gap={1}
              flexShrink={0}
            >
              <Icon asChild>
                {user.emailVerified ? (
                  <CheckCircleIcon weight="fill" />
                ) : (
                  <WarningCircleIcon weight="fill" />
                )}
              </Icon>
              {user.emailVerified ? "Verified" : "Unverified"}
            </Badge>
          </Flex>
        </SettingRow>
        <Separator />
        <SettingRow label="Member Since" description="The date your account was created.">
          <Flex align="center" gap={2}>
            <Icon color="fg.subtle" asChild>
              <CalendarIcon />
            </Icon>
            <Text fontSize="sm" color="fg.muted">
              {joinedDate}
            </Text>
          </Flex>
        </SettingRow>
        <Separator />
        <Flex align="center" justify="space-between" pt={5} gap={4} flexWrap="wrap">
          {(saved || serverError) && (
            <Alert.Root status={serverError ? "error" : "success"} alignItems="center">
              <Icon asChild>
                {serverError ? <WarningIcon weight="bold" /> : <CheckCircleIcon weight="fill" />}
              </Icon>
              <Alert.Title fontSize="sm">
                {serverError ?? "Profile updated successfully."}
              </Alert.Title>
            </Alert.Root>
          )}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty] as const}
          >
            {([canSubmit, isSubmitting, isDirty]) => (
              <Button
                type="submit"
                disabled={!canSubmit || !isDirty || !!serverError}
                loading={isSubmitting}
                colorPalette="primary"
                ml="auto"
              >
                Save Changes
                <Icon asChild>
                  <FloppyDiskIcon />
                </Icon>
              </Button>
            )}
          </form.Subscribe>
        </Flex>
      </form>
    </BaseContainer>
  );
}
