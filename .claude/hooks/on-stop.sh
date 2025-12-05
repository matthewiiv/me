#!/bin/bash


# Claude Hook: Run type checking, linting, and prettier checks on stop
# This hook runs when Claude stops to ensure code quality


echo "🔍 Running code quality checks..."
echo ""


# Track if any command fails
HAS_ERRORS=0

# Run TypeScript type checking
echo "📋 Running TypeScript type checking..."
START_TIME=$(date +%s.%N)
types_output=$(npm run check 2>&1)
types_exit=$?
if [ $types_exit -ne 0 ]; then
    HAS_ERRORS=1
    echo "❌ TypeScript type checking failed"
    echo "$types_output" >&2
else
    echo "✅ TypeScript type checking passed"
fi
END_TIME=$(date +%s.%N)
DURATION=$(awk "BEGIN {printf \"%.2f\", $END_TIME - $START_TIME}")
echo "⏱️  TypeScript check took ${DURATION}s"
echo ""


# Run unit tests
echo "🧪 Running unit tests..."
START_TIME=$(date +%s.%N)
test_output=$(npx vitest run 2>&1)
test_exit=$?
if [ $test_exit -ne 0 ]; then
    HAS_ERRORS=1
    echo "❌ Unit tests failed"
    echo "$test_output" >&2
else
    echo "✅ Unit tests passed"
fi
END_TIME=$(date +%s.%N)
DURATION=$(awk "BEGIN {printf \"%.2f\", $END_TIME - $START_TIME}")
echo "⏱️  Unit tests took ${DURATION}s"
echo ""


# Run ESLint with auto-fix
echo "🔍 Running ESLint with auto-fix..."
START_TIME=$(date +%s.%N)
eslint_output=$(npm run lint:fix -- --quiet 2>&1)
eslint_exit=$?
if [ $eslint_exit -ne 0 ]; then
    HAS_ERRORS=1
    echo "❌ ESLint found unfixable issues"
    echo "$eslint_output" >&2
else
    echo "✅ ESLint passed (auto-fixed where possible)"
fi
END_TIME=$(date +%s.%N)
DURATION=$(awk "BEGIN {printf \"%.2f\", $END_TIME - $START_TIME}")
echo "⏱️  ESLint took ${DURATION}s"
echo ""


# Run Prettier check
echo "💅 Running Prettier check..."
START_TIME=$(date +%s.%N)
prettier_output=$(npm run format 2>&1)
prettier_exit=$?
if [ $prettier_exit -ne 0 ]; then
    HAS_ERRORS=1
    echo "❌ Prettier formatting issues found"
    echo "$prettier_output" >&2
else
    echo "✅ Prettier formatting is correct"
fi
END_TIME=$(date +%s.%N)
DURATION=$(awk "BEGIN {printf \"%.2f\", $END_TIME - $START_TIME}")
echo "⏱️  Prettier check took ${DURATION}s"
echo ""


# Summary
if [ $HAS_ERRORS -eq 0 ]; then
    echo "✨ All checks passed!"
else
    echo "⚠️  Some checks failed. Please review the errors above."
fi


# Return appropriate exit code - exit 2 if any checks failed
if [ $HAS_ERRORS -ne 0 ]; then
    exit 2
else
    exit 0
fi
