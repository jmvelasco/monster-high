## 1. Domain Layer

- [x] 1.1 Update `FriendGroup` interface in `apps/web/src/domain/friends/FriendGroup.ts` to include `slug: string`.
- [x] 1.2 Update `createFriendGroup` factory to generate `slug` using the `generateSlug` utility. Update corresponding unit tests.

## 2. Infrastructure Layer

- [x] 2.1 Add `findBySlug(slug: string): Promise<FriendGroup | null>` to the `FriendGroupRepository` interface.
- [x] 2.2 Implement `findBySlug` in `LocalStorageFriendGroupRepository` and ensure it handles on-the-fly slug generation for legacy groups. Add/update unit tests.

## 3. Application Layer

- [x] 3.1 Expose a way to fetch a single group by slug within a hook (either adding to `useFriendGroups` or creating a new `useFriendGroupDetail` hook).

## 4. UI Layer

- [x] 4.1 Create a reusable `ConfirmDialog` component for the UI (e.g., `apps/web/src/components/ui/ConfirmDialog.tsx`).
- [ ] 4.2 Create `FriendGroupDetailPage` (`apps/web/src/pages/FriendGroupDetailPage.tsx`) to display group details and the "Delete Group" action.
- [ ] 4.3 Update `FriendGroupsPage` to remove the inline delete button and wrap the group cards in a `<Link to={\`/friends/\${group.slug}\`}>`.
- [ ] 4.4 Add the new route (`/friends/:slug`) to `apps/web/src/App.tsx`.
