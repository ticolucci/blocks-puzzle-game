# Blocs Puzzle Game
read @README.md

## Development Workflow
If you need to know the architecture of the project, check @docs/architecture.md

### Test-Driven Development (TDD) Process

**DEFAULT WORKFLOW:** ALL new features MUST follow the TDD workflow unless explicitly stated otherwise.

#### TDD Red-Green-Refactor Cycle

**1. RED Phase - Write Failing Tests First**
- Before writing any implementation code, write tests that describe the desired behavior
- Run tests to confirm they fail for the right reason (feature doesn't exist, not syntax errors)
- Tests should clearly express the expected functionality
- Commit message: `test: add failing test for [feature name]`

**2. GREEN Phase - Make Tests Pass with Minimal Code**
- Write the simplest code possible to make the test pass
- Do NOT optimize, add extra features, or over-engineer
- Focus only on making the current test pass
- Run tests to confirm they pass
- Commit message: `feat: implement [feature name]`

**3. REFACTOR Phase - Improve Code Quality**
- **CRITICAL:** After tests pass (green), MUST suggest refactoring opportunities
- Present 1-5 specific refactoring options (description-only) for user to choose from
- Example refactoring options:
  - Extract helper functions
  - Remove code duplication
  - Improve naming clarity
  - Split large components
  - Extract reusable logic
  - Improve type safety
  - Add accessibility improvements
  - Extract constants or configuration
- Refactorings should be meaningful to the quality of the code (readability/maintenability) without adding new functionality.
- It's OK (and encouraged) to present fewer suggestions if they are not meaningful
- User selects which refactorings to apply (if any)
- After refactoring, run tests again to ensure they still pass
- Commit message: `refactor: [description of refactoring]`

**4. Repeat**
- Continue the Red-Green-Refactor cycle for each new piece of functionality
- Keep iterations small and focused on one feature at a time

#### When NOT to Follow TDD

Skip TDD only when:
- User explicitly states "do not use TDD", "skip testing", or "no tests"
- Working on configuration files (package.json, babel.config.js, etc.)
- Creating documentation (README, comments)
- Fixing trivial typos or formatting issues
- User requests "quick prototype" or "spike solution"

**If in doubt, use TDD.** It's the default workflow.

#### Testing Best Practices

**Component Testing (React Native):**
- Test user-visible behavior, not implementation details
- Use React Native Testing Library queries (getByText, getByTestId, etc.)
- Test accessibility features
- Avoid testing internal state or private methods directly

**What to Test:**
- Component renders correctly with different props
- User interactions work as expected (button presses, input changes)
- Conditional rendering based on props/state
- Navigation behavior
- Game logic and business rules
- Edge cases and error states

**What NOT to Test:**
- Implementation details (how a component does something internally)
- Third-party library functionality (already tested by library authors)
- Styling specifics unless critical to functionality

**Test Organization:**
- Use `__tests__/` directories co-located with source files
- Name test files: `ComponentName.test.js` or `functionName.test.js`
- Group related tests using `describe()` blocks
- Keep test descriptions clear and specific

#### Example TDD Workflow

**User Request:** "Add a score counter to the game screen"

**Step 1 - RED:**
```javascript
// GameScreen.test.js
test('displays score counter starting at 0', () => {
  render(<GameScreen />);
  expect(screen.getByText('Score: 0')).toBeTruthy();
});
```
Run tests → FAILS (feature doesn't exist)

**Step 2 - GREEN:**
```javascript
// GameScreen.js
export default function GameScreen() {
  return (
    <View>
      <Text>Score: 0</Text>
    </View>
  );
}
```
Run tests → PASSES

**Step 3 - REFACTOR:**
Present options to user:
1. Extract ScoreCounter into separate component for reusability
2. Add dynamic score state management with useState
3. Add accessibility label for screen readers
4. Extract "Score:" label text as a constant
5. Add prop-types validation for type safety

User selects option 1 and 3. Apply refactorings, then run tests → STILL PASSES

#### Commit Strategy with TDD

Each TDD phase should result in a commit:
1. **RED:** Commit failing tests
2. **GREEN:** Commit minimal implementation
3. **REFACTOR:** Commit refactoring changes (after user approval)

This creates a clear development history and makes it easy to understand how features evolved.


