import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import Button from "../components/Button";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import useToast from "../hooks/useToast";
import Icon from "../components/Icon";
import { FilePencilOutlined } from "@lineiconshq/free-icons";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const { user, updateProfile, getProfile } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", bio: "" },
  });

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await getProfile();
      const currentProfile = profileData || userRef.current;
      if (currentProfile) {
        reset({
          name: currentProfile.name || "",
          email: currentProfile.email || "",
          bio: currentProfile.bio || "",
        });
        setProfile(currentProfile);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [getProfile, reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function onSubmit(data) {
    try {
      const userId = profile?.id || profile?._id || user?.id || user?._id;
      const response = await updateProfile(userId, data);
      const updatedProfile = response || data;
      setProfile((prev) => ({ ...prev, ...updatedProfile }));
      reset({
        name: updatedProfile.name || data.name,
        email: updatedProfile.email || data.email,
        bio: updatedProfile.bio || data.bio,
      });
      setIsEditing(false);
      setError(null);
      if (toast) toast("Profile updated", "success");
    } catch (err) {
      const errMsg = err?.message || "Failed to update profile";
      setError(errMsg);
      if (toast?.error) toast.error(errMsg);
    }
  }

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <span style={{ color: "var(--color-ink-muted)" }}>Loading profile…</span>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="page-inner">
        <ErrorState
          title="Failed to Load Profile"
          message={typeof error === "string" ? error : error?.message}
          onRetry={fetchProfile}
          retryText="Reload Profile"
        />
      </div>
    );
  }

  return (
    <div className="page-inner max-w-2xl">
      <header className="mb-8">
        <h1
          className="font-display text-3xl font-semibold tracking-tight"
          style={{ color: "var(--color-ink)" }}
        >
          Profile
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-ink-muted)" }}>
          Manage your account details
        </p>
      </header>

      {!isEditing ? (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: "var(--color-paper-3)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            className="flex items-center gap-5 border-b p-6"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-paper-2)",
            }}
          >
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold"
              style={{
                backgroundColor: "var(--color-accent-soft)",
                color: "var(--color-accent)",
              }}
            >
              {initials}
            </span>
            <div className="min-w-0">
              <h2
                className="font-display text-xl font-semibold truncate"
                style={{ color: "var(--color-ink)" }}
              >
                {profile?.name}
              </h2>
              <p className="text-sm truncate" style={{ color: "var(--color-ink-muted)" }}>
                {profile?.email}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: "var(--color-ink-faint)" }}
              >
                Bio
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
                {profile?.bio || "No bio added yet."}
              </p>
            </div>

            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              <Icon icon={FilePencilOutlined} size={16} />
              Edit profile
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border p-6 space-y-5"
          style={{
            backgroundColor: "var(--color-paper-3)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
              Name
            </label>
            <input
              id="name"
              type="text"
              className="input-field"
              {...register("name", {
                required: "Name is required",
                maxLength: { value: 80, message: "Can't be greater than 80 characters" },
                minLength: { value: 2, message: "Must be at least 2 characters" },
              })}
            />
            {errors.name && (
              <p className="text-xs" style={{ color: "var(--color-danger)" }}>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              disabled
              className="input-field opacity-60 cursor-not-allowed"
              {...register("email")}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bio" className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              className="input-field resize-none"
              placeholder="Tell us a little about yourself…"
              {...register("bio", {
                minLength: { value: 20, message: "Bio must be at least 20 characters" },
              })}
            />
            {errors.bio && (
              <p className="text-xs" style={{ color: "var(--color-danger)" }}>
                {errors.bio.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset(profile);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfilePage;
