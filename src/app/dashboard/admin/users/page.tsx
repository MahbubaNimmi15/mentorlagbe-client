
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  RotateCcw,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";

type Role = "student" | "tutor" | "admin";
type Plan = "free" | "pro";
type RoleFilter = Role | "all";

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  plan: Plan;
  phone: string;
  bio: string;
  joinedAt: string;
};

const initialUsers: DemoUser[] = [
  {
    id: "USR-101",
    name: "Ayesha Rahman",
    email: "ayesha@example.com",
    role: "tutor",
    plan: "pro",
    phone: "01700000001",
    bio: "Mathematics and Science tutor with five years of teaching experience.",
    joinedAt: "2026-11-12",
  },
  {
    id: "USR-102",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    role: "student",
    plan: "free",
    phone: "01800000002",
    bio: "Class 10 student preparing for SSC examinations.",
    joinedAt: "2026-11-13",
  },
  {
    id: "USR-103",
    name: "Rafi Ahmed",
    email: "rafi@example.com",
    role: "student",
    plan: "pro",
    phone: "01900000003",
    bio: "Interested in programming and mathematics.",
    joinedAt: "2026-11-14",
  },
  {
    id: "USR-104",
    name: "Tanvir Hasan",
    email: "tanvir@example.com",
    role: "tutor",
    plan: "free",
    phone: "01600000004",
    bio: "English and IELTS tutor.",
    joinedAt: "2026-11-15",
  },
  {
    id: "USR-105",
    name: "Sadia Islam",
    email: "sadia@example.com",
    role: "student",
    plan: "free",
    phone: "01500000005",
    bio: "HSC candidate looking for Physics mentorship.",
    joinedAt: "2026-11-16",
  },
  {
    id: "USR-106",
    name: "Demo Administrator",
    email: "admin-demo@example.com",
    role: "admin",
    plan: "free",
    phone: "00000000000",
    bio: "Sample administrator account for dashboard preview.",
    joinedAt: "2026-11-01",
  },
];

const roleStyles: Record<Role, string> = {
  student: "bg-blue-100 text-blue-800",
  tutor: "bg-violet-100 text-violet-800",
  admin: "bg-orange-100 text-orange-800",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#e97c53] focus:ring-2 focus:ring-orange-100";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DemoUser[]>(() =>
    initialUsers.map((user) => ({ ...user }))
  );

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("all");

  const [selectedUser, setSelectedUser] =
    useState<DemoUser | null>(null);

  const [roleChange, setRoleChange] = useState<{
    userId: string;
    nextRole: Role;
  } | null>(null);

  const [message, setMessage] = useState("");

  const stats = useMemo(
    () => ({
      total: users.length,
      students: users.filter(
        (user) => user.role === "student"
      ).length,
      tutors: users.filter(
        (user) => user.role === "tutor"
      ).length,
      admins: users.filter(
        (user) => user.role === "admin"
      ).length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch = [
        user.id,
        user.name,
        user.email,
        user.phone,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const changingUser = roleChange
    ? users.find((user) => user.id === roleChange.userId)
    : null;

  function requestRoleChange(user: DemoUser, nextRole: Role) {
    if (user.role === nextRole) return;

    setMessage("");
    setRoleChange({
      userId: user.id,
      nextRole,
    });
  }

  function confirmRoleChange() {
    if (!roleChange || !changingUser) return;

    const isLastAdmin =
      changingUser.role === "admin" &&
      stats.admins <= 1 &&
      roleChange.nextRole !== "admin";

    if (isLastAdmin) {
      setMessage(
        "The last demo administrator cannot be demoted."
      );
      setRoleChange(null);
      return;
    }

    const nextRole = roleChange.nextRole;
    const userName = changingUser.name;

    setUsers((current) =>
      current.map((user) =>
        user.id === roleChange.userId
          ? { ...user, role: nextRole }
          : user
      )
    );

    setRoleChange(null);
    setSelectedUser(null);

    setMessage(
      `${userName}'s demo role changed to ${capitalize(
        nextRole
      )}. No real account was updated.`
    );
  }

  function resetDemo() {
    setUsers(initialUsers.map((user) => ({ ...user })));
    setSearch("");
    setRoleFilter("all");
    setSelectedUser(null);
    setRoleChange(null);
    setMessage("Original demo records restored.");
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#e97c53]"
            >
              <ArrowLeft size={17} />
              Admin Overview
            </Link>

            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#e97c53]">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#14243a]">
              User Management
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Browse users and preview role management.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
            <ShieldCheck size={18} />
            Demo Mode
          </div>
        </header>

        {/* Warning */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Demo Data Only:</strong> These accounts are
          fictional. Role changes update this browser session
          and reset after refresh. Real account management
          requires authentication and protected Admin APIs.
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total Users",
              value: stats.total,
              icon: Users,
            },
            {
              label: "Students",
              value: stats.students,
              icon: Users,
            },
            {
              label: "Tutors",
              value: stats.tutors,
              icon: UserCog,
            },
            {
              label: "Admins",
              value: stats.admins,
              icon: ShieldCheck,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0e7] text-[#e97c53]">
                  <Icon size={21} />
                </div>

                <p className="text-sm font-semibold text-slate-500">
                  {item.label}
                </p>

                <p className="mt-2 text-3xl font-extrabold text-[#14243a]">
                  {item.value}
                </p>
              </article>
            );
          })}
        </section>

        {/* User List */}
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#14243a]">
                Registered Users
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredUsers.length} of {users.length}
                {" "}sample users
              </p>
            </div>

            <button
              type="button"
              onClick={resetDemo}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset Demo
            </button>
          </div>

          {message && (
            <div
              role="status"
              className="mt-5 rounded-xl bg-[#e3f4e8] p-4 text-sm font-medium text-emerald-900"
            >
              {message}
            </div>
          )}

          {/* Search & Role Filter */}
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_190px]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-3.5 text-slate-400"
              />

              <label htmlFor="user-search" className="sr-only">
                Search users
              </label>

              <input
                id="user-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search name, email, phone..."
                className={`${inputClass} pl-11`}
              />
            </div>

            <div>
              <label htmlFor="role-filter" className="sr-only">
                Filter by role
              </label>

              <select
                id="role-filter"
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(
                    event.target.value as RoleFilter
                  )
                }
                className={inputClass}
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="tutor">Tutors</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Plan</th>
                  <th className="px-4 py-4">Joined</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 hover:bg-orange-50/40"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e3f4e8] text-sm font-bold text-emerald-800">
                          {initials(user.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-[#14243a]">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {user.email}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${roleStyles[user.role]}`}
                      >
                        {capitalize(user.role)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          user.plan === "pro"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {capitalize(user.plan)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-slate-500">
                      {formatDate(user.joinedAt)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Details
                        </button>

                        <select
                          aria-label={`Change role for ${user.name}`}
                          value={user.role}
                          onChange={(event) =>
                            requestRoleChange(
                              user,
                              event.target.value as Role
                            )
                          }
                          className="rounded-lg border border-orange-200 bg-white px-2 py-2 text-xs font-bold text-[#bd5a32] outline-none"
                        >
                          <option value="student">Student</option>
                          <option value="tutor">Tutor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="py-12 text-center">
                <p className="font-bold text-[#14243a]">
                  No users found
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Try changing the search or role filter.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14243a]/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-details-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id="user-details-title"
                className="text-xl font-extrabold text-[#14243a]"
              >
                User Details
              </h2>

              <button
                type="button"
                aria-label="Close details"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["User ID", selectedUser.id],
                ["Full Name", selectedUser.name],
                ["Email", selectedUser.email],
                ["Phone", selectedUser.phone],
                ["Role", capitalize(selectedUser.role)],
                ["Plan", capitalize(selectedUser.plan)],
                ["Joined", formatDate(selectedUser.joinedAt)],
                ["Bio", selectedUser.bio],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-slate-100 pb-3"
                >
                  <p className="text-xs font-bold text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 break-words text-sm font-medium text-[#14243a]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full rounded-xl bg-[#14243a] px-5 py-3 text-sm font-bold text-white"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Modal */}
      {roleChange && changingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14243a]/70 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="role-confirm-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#e97c53]">
              <UserCog size={24} />
            </div>

            <h2
              id="role-confirm-title"
              className="text-xl font-extrabold text-[#14243a]"
            >
              Confirm Role Change
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Change <strong>{changingUser.name}</strong>
              {" "}from{" "}
              <strong>
                {capitalize(changingUser.role)}
              </strong>
              {" "}to{" "}
              <strong>
                {capitalize(roleChange.nextRole)}
              </strong>
              ?
            </p>

            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              This is a demo change only. No real permissions,
              accounts or database documents will be modified.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {/* Corrected Cancel Button */}
              <button
                type="button"
                onClick={() => setRoleChange(null)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmRoleChange}
                className="inline-flex items-center gap-2 rounded-xl bg-[#e97c53] px-4 py-3 text-sm font-bold text-white hover:bg-[#d96c45]"
              >
                <Check size={16} />
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
