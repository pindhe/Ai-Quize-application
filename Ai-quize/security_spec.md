# Security Specification for AI Quiz Battle

## Data Invariants
1. A user profile must have non-negative XP, coins, and level.
2. A question must have exactly 4 options and a correctIndex between 0 and 3.
3. Leaderboard entries must be linked to a valid user ID.
4. Users can only update their own profile data (with specific logic for XP/coins incrementing).

## The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Attempting to create a user profile for a different UID.
2. **Resource Poisoning**: Large strings in question text or user names (e.g., 2MB).
3. **Price Manipulation**: Directly setting `coins` to 999,999 without earning them.
4. **XP injection**: Setting `level` to 100 on document creation.
5. **Orphaned Leaderboard**: Creating a leaderboard entry for a non-existent user.
6. **Shadow Fields**: Adding `isAdmin: true` to a user profile.
7. **Malicious Question**: Setting `correctIndex` to 10.
8. **PII Leak**: Reading another user's private data (if any).
9. **Spam Leaderboard**: Flooding the leaderboard with fake entries.
10. **Immutable Check**: Changing `userId` on an existing leaderboard entry.
11. **Verified ONLY**: Writing to the database without a verified email (if required).
12. **Status Shortcut**: Skipping levels or achievements by direct write.

## Test Runner (TDD)
(Implemented in firestore.rules.test.ts)
