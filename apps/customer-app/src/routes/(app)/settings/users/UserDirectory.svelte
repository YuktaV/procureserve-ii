  <!-- Users Table -->
  <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            {#if canEdit}
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            {/if}
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Active Users -->
          {#each users as user}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-indigo-800">
                      {formatUserName(user).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{formatUserName(user)}</div>
                    <div class="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full {getRoleBadgeColor(user.role)}">
                  {user.role}
                </span>
              </td>
              <td class="px-6 py-4">
                <PermissionMatrix permissions={user.process_permissions} />
              </td>
              <td class="px-6 py-4">
                <UserStatusBadge isActive={user.is_active} lastLoginAt={user.last_login_at} />
              </td>
              {#if canEdit}
                <td class="px-6 py-4 text-right">
                  <a href="/settings/users/{user.id}/edit" class="text-indigo-600 hover:text-indigo-900 text-sm">
                    Edit
                  </a>
                </td>
              {/if}
            </tr>
          {/each}

          <!-- Pending Invitations -->
          {#each invitations as invitation}
            <tr class="hover:bg-gray-50 bg-yellow-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-yellow-800">
                      {invitation.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{invitation.email}</div>
                    <div class="text-sm text-gray-500">Invitation pending</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full {getRoleBadgeColor(invitation.role)}">
                  {invitation.role}
                </span>
              </td>
              <td class="px-6 py-4">
                <PermissionMatrix permissions={invitation.process_permissions} />
              </td>
              <td class="px-6 py-4">
                <UserStatusBadge isActive={true} isPending={true} />
              </td>
              {#if canEdit}
                <td class="px-6 py-4 text-right">
                  <button class="text-red-600 hover:text-red-900 text-sm">
                    Cancel
                  </button>
                </td>
              {/if}
            </tr>
          {/each}

          {#if users.length === 0 && invitations.length === 0}
            <tr>
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                No users found
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
