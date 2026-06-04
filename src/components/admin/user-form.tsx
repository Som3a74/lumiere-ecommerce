"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveUser } from "@/app/actions/admin-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFormProps {
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  } | null;
}

export function UserForm({ user }: UserFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function action(formData: FormData) {
    if (user) formData.append("id", user.id);
    startTransition(async () => {
      try {
        await saveUser(formData);
        toast.success(user ? "User updated" : "User created");
        router.push("/admin/users");
        router.refresh();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "Failed to save user");
        } else {
          toast.error("Failed to save user");
        }
      }
    });
  }

  return (
    <form action={action} className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div className="bg-surface border border-outline-variant/30 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              defaultValue={user?.first_name}
              placeholder="e.g. John"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              defaultValue={user?.last_name}
              placeholder="e.g. Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user?.email}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {user ? "New Password (leave blank to keep current)" : "Password"}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required={!user}
              minLength={6}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue={user?.role || "customer"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {user ? "Save Changes" : "Create User"}
          </Button>
        </div>
      </div>
    </form>
  );
}
