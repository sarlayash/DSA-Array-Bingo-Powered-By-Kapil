// 90 DSA Array Problems, Patterns, and Fun Facts
// Authentic LeetCode classics, time complexities, memory insights & coding tricks!

const DSA_FACTS = {
  1: {
    num: 1,
    title: "Two Sum (LeetCode #1)",
    pattern: "Hash Map / Frequency Array",
    complexity: "O(N) Time, O(N) Space",
    fact: "The legendary LeetCode #1! Instead of nested loops O(N²), store complements `target - num` in a hash table or direct address array for instant O(1) lookup.",
    formula: "complement = target - nums[i]",
    tag: "Core Classic"
  },
  2: {
    num: 2,
    title: "Two Pointers Technique",
    pattern: "Two Pointers",
    complexity: "O(N) Time, O(1) Space",
    fact: "If the array is sorted, place one pointer at index 0 and another at index N-1. Move inwards based on condition. Zero extra memory needed!",
    formula: "while (left < right) { ... }",
    tag: "Fundamental Pattern"
  },
  3: {
    num: 3,
    title: "Dutch National Flag Algorithm",
    pattern: "3-Way Partitioning",
    complexity: "O(N) Time, O(1) Space",
    fact: "Invented by Edsger W. Dijkstra! Sorts an array containing 0s, 1s, and 2s in a single pass using three pointers: low, mid, and high.",
    formula: "swap(nums[mid], nums[low++]); mid++",
    tag: "Dijkstra Classic"
  },
  4: {
    num: 4,
    title: "4Sum (LeetCode #18)",
    pattern: "K-Sum Generalization",
    complexity: "O(N³) Time, O(1) Space",
    fact: "Any K-Sum problem on arrays can be solved recursively by reducing K to K-1 until K=2, then using the standard Two Pointers technique on the sorted array.",
    formula: "reduce K-Sum -> 2-Sum with recursion",
    tag: "Multi-Pointer"
  },
  5: {
    num: 5,
    title: "Sliding Window Pattern",
    pattern: "Sliding Window",
    complexity: "O(N) Time, O(1) Space",
    fact: "Instead of recalculating subarrays of size K from scratch in O(N*K), slide the window by subtracting the left element leaving and adding the new right element!",
    formula: "windowSum += nums[i] - nums[i - k]",
    tag: "Window Magic"
  },
  6: {
    num: 6,
    title: "Prefix Sum Array",
    pattern: "Prefix Preprocessing",
    complexity: "O(1) Query, O(N) Preprocess",
    fact: "Store cumulative sums `prefix[i] = prefix[i-1] + arr[i]`. Any range sum query `sum(L, R)` is computed in blazing fast O(1) time: `prefix[R] - prefix[L-1]`!",
    formula: "rangeSum(L, R) = prefix[R] - prefix[L - 1]",
    tag: "O(1) Query"
  },
  7: {
    num: 7,
    title: "Boyer-Moore Majority Vote",
    pattern: "Streaming & Voting",
    complexity: "O(N) Time, O(1) Space",
    fact: "Finds the element appearing > N/2 times in an array with zero hash maps. Cancel out differing elements; the true majority candidate always survives!",
    formula: "count += (num === candidate) ? 1 : -1",
    tag: "Algorithmic Gem"
  },
  8: {
    num: 8,
    title: "Search in Rotated Sorted Array",
    pattern: "Modified Binary Search",
    complexity: "O(log N) Time, O(1) Space",
    fact: "Even when an array is cyclically shifted, at least one half (left or right) is ALWAYS strictly sorted! Check which half is sorted to eliminate the other.",
    formula: "if (nums[low] <= nums[mid]) ...",
    tag: "Binary Search"
  },
  9: {
    num: 9,
    title: "Next Permutation",
    pattern: "Lexicographical Order",
    complexity: "O(N) Time, O(1) Space",
    fact: "Find the pivot from right where `arr[i] < arr[i+1]`. Swap with next larger element from right, then reverse everything to the right for in-place lexicographic next!",
    formula: "pivot -> swap next greater -> reverse suffix",
    tag: "Math & Arrays"
  },
  10: {
    num: 10,
    title: "Trapping Rain Water (LeetCode #42)",
    pattern: "Two Pointers / Prefix Max",
    complexity: "O(N) Time, O(1) Space",
    fact: "Water trapped at index i is `min(maxLeft, maxRight) - height[i]`. Two pointers moving from edges keep track of current boundary ceilings without auxiliary arrays!",
    formula: "trapped += max(0, min(leftMax, rightMax) - h[i])",
    tag: "Hard Classic"
  },
  11: {
    num: 11,
    title: "Container With Most Water",
    pattern: "Greedy Two Pointers",
    complexity: "O(N) Time, O(1) Space",
    fact: "Area is `(right - left) * min(h[left], h[right])`. Always greedily advance the pointer with the shorter height because only a taller wall could increase capacity!",
    formula: "area = (R - L) * min(h[L], h[R])",
    tag: "Greedy Classic"
  },
  12: {
    num: 12,
    title: "Merge Intervals (LeetCode #56)",
    pattern: "Interval Sorting",
    complexity: "O(N log N) Time, O(N) Space",
    fact: "Sort intervals by start time. If `current.start <= prev.end`, merge them by expanding `prev.end = max(prev.end, current.end)`. Linear scan after sort!",
    formula: "if (curr[0] <= prev[1]) prev[1] = max(prev[1], curr[1])",
    tag: "Intervals"
  },
  13: {
    num: 13,
    title: "Kadane's Algorithm",
    pattern: "Dynamic Programming / Greedy",
    complexity: "O(N) Time, O(1) Space",
    fact: "Finds the maximum subarray sum in a single pass! At each index, decide whether to start a fresh subarray or extend the previous running sum.",
    formula: "currSum = Math.max(x, currSum + x)",
    tag: "Hall of Fame"
  },
  14: {
    num: 14,
    title: "Next Greater Element (Monotonic Stack)",
    pattern: "Monotonic Stack",
    complexity: "O(N) Time, O(N) Space",
    fact: "Maintain indices in a decreasing stack. When a larger number arrives, it resolves all smaller pending elements in the stack! Each element is pushed and popped at most once.",
    formula: "while (stack.length && arr[i] > arr[top]) pop()",
    tag: "Stack & Array"
  },
  15: {
    num: 15,
    title: "Find Duplicate (Floyd's Tortoise & Hare)",
    pattern: "Array as a Linked List",
    complexity: "O(N) Time, O(1) Space",
    fact: "Since numbers are in range [1..n], interpret each array value `nums[i]` as a pointer `next = nums[i]`. A duplicate value creates a cycle in the implicit linked list!",
    formula: "slow = nums[slow]; fast = nums[nums[fast]]",
    tag: "Cycle Detection"
  },
  16: {
    num: 16,
    title: "3Sum (LeetCode #15)",
    pattern: "Sort + Two Pointers",
    complexity: "O(N²) Time, O(1) Extra Space",
    fact: "Sort the array, fix the first number `nums[i]`, and run Two Pointers on the remaining subarray. Skip identical consecutive numbers to guarantee zero duplicate triplets!",
    formula: "nums[i] + nums[left] + nums[right] === 0",
    tag: "Interview Favorite"
  },
  17: {
    num: 17,
    title: "Product of Array Except Self",
    pattern: "Prefix & Suffix Products",
    complexity: "O(N) Time, O(1) Extra Space",
    fact: "Compute products without division operator: run a left pass storing cumulative prefix products, then run a backward right pass accumulating running suffix products into the answer!",
    formula: "ans[i] = prefixProd[i-1] * suffixProd[i+1]",
    tag: "No-Division Trick"
  },
  18: {
    num: 18,
    title: "Maximum Product Subarray",
    pattern: "Dynamic Programming",
    complexity: "O(N) Time, O(1) Space",
    fact: "Multiplying by a negative number flips the minimum into the maximum! Maintain BOTH running `maxProd` and `minProd` at each step to handle double negatives seamlessly.",
    formula: "swap(maxProd, minProd) when num < 0",
    tag: "DP Masterclass"
  },
  19: {
    num: 19,
    title: "Subarray Sum Equals K (LeetCode #560)",
    pattern: "Prefix Sum + Hash Map",
    complexity: "O(N) Time, O(N) Space",
    fact: "If `prefixSum[j] - prefixSum[i] = K`, then subarray between i and j sums to K. Store count of prefix sums in a map to query matching prior prefixes in O(1)!",
    formula: "count += map[currPrefix - K] || 0",
    tag: "Subarray Magic"
  },
  20: {
    num: 20,
    title: "Median of Two Sorted Arrays",
    pattern: "Binary Search on Partition",
    complexity: "O(log(min(M, N))) Time",
    fact: "Binary search on the smaller array to cut both arrays into left and right halves where all left elements <= all right elements. The ultimate Hard benchmark!",
    formula: "partitionX + partitionY = (M + N + 1) / 2",
    tag: "Hard Benchmark"
  },
  21: {
    num: 21,
    title: "Cache Locality & Memory Layout",
    pattern: "Hardware & Systems Architecture",
    complexity: "O(1) Sequential Cache Hits",
    fact: "Arrays are stored in contiguous memory! When CPU accesses `arr[i]`, an entire 64-byte Cache Line is preloaded into L1/L2 cache, making array iterations 10x faster than linked lists.",
    formula: "Memory address = Base + (Index * ElementSize)",
    tag: "Hardware Speed"
  },
  22: {
    num: 22,
    title: "Spiral Matrix Traversal",
    pattern: "Simulation & Matrix Boundaries",
    complexity: "O(M * N) Time, O(1) Space",
    fact: "Track four boundary walls: `top`, `bottom`, `left`, `right`. Traverse right across top, down right column, left across bottom, and up left column, shrinking walls each round.",
    formula: "top++, right--, bottom--, left++",
    tag: "2D Matrix"
  },
  23: {
    num: 23,
    title: "Rotate Image 90° In-Place",
    pattern: "Matrix Transpose & Reflection",
    complexity: "O(N²) Time, O(1) Extra Space",
    fact: "Rotating an N×N matrix clockwise by 90 degrees equals Transpose (swap `matrix[i][j]` with `matrix[j][i]`) followed by Reversing each row horizontally!",
    formula: "Rotate = Transpose() + ReverseRows()",
    tag: "Matrix Geometry"
  },
  24: {
    num: 24,
    title: "Pascal's Triangle",
    pattern: "Dynamic Programming / Combinatorics",
    complexity: "O(N²) Time, O(N²) Space",
    fact: "Each number is the sum of the two numbers directly above it: `row[j] = prev[j-1] + prev[j]`. Also calculates binomial coefficients nCr in pure array format!",
    formula: "C(n, k) = n! / (k! * (n-k)!)",
    tag: "Math & DP"
  },
  25: {
    num: 25,
    title: "Set Matrix Zeroes",
    pattern: "In-Place State Flagging",
    complexity: "O(M * N) Time, O(1) Space",
    fact: "To zero rows and columns without extra memory, reuse the 0th row and 0th column of the matrix itself as state indicator arrays for all other rows and columns!",
    formula: "matrix[i][0] = 0; matrix[0][j] = 0",
    tag: "Space Optimization"
  },
  26: {
    num: 26,
    title: "Conway's Game of Life In-Place",
    pattern: "2-Bit State Encoding",
    complexity: "O(M * N) Time, O(1) Space",
    fact: "Encode past state in bit 0 and future state in bit 1! `01` means dead -> alive, `10` means alive -> dead. Shift right by 1 bit at the end to get the updated matrix.",
    formula: "state |= (nextState << 1); next = state >> 1",
    tag: "Bit Packing"
  },
  27: {
    num: 27,
    title: "Longest Consecutive Sequence",
    pattern: "Hash Set Intelligent Lookup",
    complexity: "O(N) Time, O(N) Space",
    fact: "Insert all numbers into a Hash Set. Only start counting a sequence if `num - 1` does NOT exist in the set! This ensures each sequence is traversed only once.",
    formula: "if (!set.has(num - 1)) { countSeq(num); }",
    tag: "Set Optimization"
  },
  28: {
    num: 28,
    title: "First Missing Positive",
    pattern: "Cyclic Sort / Index Placement",
    complexity: "O(N) Time, O(1) Space",
    fact: "The smallest missing positive must be in range `[1 .. N+1]`. Place each number `X` at index `X-1` via swaps. The first index where `nums[i] !== i + 1` is your answer!",
    formula: "while (nums[i] > 0 && nums[nums[i]-1] !== nums[i]) swap()",
    tag: "Hard In-Place"
  },
  29: {
    num: 29,
    title: "Jump Game (Greedy Reachability)",
    pattern: "Greedy Farthest Reach",
    complexity: "O(N) Time, O(1) Space",
    fact: "Keep a single variable `maxReach = max(maxReach, i + nums[i])`. If the current index `i > maxReach`, you are stranded and can never progress further!",
    formula: "maxReach = Math.max(maxReach, i + nums[i])",
    tag: "Greedy Reach"
  },
  30: {
    num: 30,
    title: "Gas Station Circular Tour",
    pattern: "Greedy Deficit Accumulation",
    complexity: "O(N) Time, O(1) Space",
    fact: "If total gas >= total cost, a valid starting station is guaranteed to exist! If `currTank < 0` at station i, no station before or at i can be the start; reset start to `i + 1`.",
    formula: "if (tank < 0) { start = i + 1; tank = 0; }",
    tag: "Greedy Circular"
  },
  31: {
    num: 31,
    title: "Candy Distribution (LeetCode #135)",
    pattern: "Two-Pass Greedy Sweep",
    complexity: "O(N) Time, O(N) Space",
    fact: "Pass left-to-right: give more candy if rating > left neighbor. Pass right-to-left: give `max(current, right + 1)` if rating > right neighbor. Global optimality achieved!",
    formula: "candy[i] = Math.max(candy[i], candy[i+1] + 1)",
    tag: "Two-Pass Greedy"
  },
  32: {
    num: 32,
    title: "Insert Interval",
    pattern: "Linear / Binary Partition",
    complexity: "O(N) Time, O(N) Space",
    fact: "Three distinct zones: 1) Add all intervals ending before the new interval starts. 2) Merge all overlapping intervals into one. 3) Append all remaining intervals.",
    formula: "newInterval[0] = min(start), newInterval[1] = max(end)",
    tag: "Interval Logic"
  },
  33: {
    num: 33,
    title: "Search a 2D Matrix as 1D Array",
    pattern: "Coordinate Virtual Flattening",
    complexity: "O(log(M * N)) Time, O(1) Space",
    fact: "A row-sorted M×N matrix is virtually a 1D array of length M*N! Virtual index `mid` maps directly to `row = Math.floor(mid / cols)` and `col = mid % cols`.",
    formula: "matrix[Math.floor(idx / C)][idx % C]",
    tag: "Coordinate Math"
  },
  34: {
    num: 34,
    title: "Find Peak Element in Unsorted Array",
    pattern: "Binary Search on Gradient",
    complexity: "O(log N) Time, O(1) Space",
    fact: "You don't need a sorted array for binary search! If `nums[mid] < nums[mid+1]`, there is guaranteed to be at least one peak in the right uphill half. Follow the slope!",
    formula: "if (nums[mid] < nums[mid + 1]) low = mid + 1",
    tag: "Slope Binary Search"
  },
  35: {
    num: 35,
    title: "Sort Colors (0s, 1s, 2s)",
    pattern: "Single-Pass In-Place Swap",
    complexity: "O(N) Time, O(1) Space",
    fact: "With pointers `left=0`, `mid=0`, `right=n-1`: if `nums[mid] == 0` swap with left; if `nums[mid] == 2` swap with right (don't increment mid yet!). Pure elegance.",
    formula: "0 -> left bucket, 2 -> right bucket, 1 -> mid",
    tag: "Pointer Swaps"
  },
  36: {
    num: 36,
    title: "Quickselect (Kth Largest Element)",
    pattern: "Divide & Conquer Partition",
    complexity: "O(N) Average Time, O(1) Space",
    fact: "Tony Hoare's Quickselect uses Quicksort partitioning, but recurses only into the single partition containing index K! Cuts average sorting time from O(N log N) to O(N).",
    formula: "if (pivotIdx === target) return nums[pivotIdx]",
    tag: "Hoare Algorithm"
  },
  37: {
    num: 37,
    title: "Top K Frequent Elements (Bucket Sort)",
    pattern: "Frequency Bucket Array",
    complexity: "O(N) Time, O(N) Space",
    fact: "Instead of a heap O(N log K), create an array of buckets where index = frequency (up to N). Place elements in `bucket[freq]`, then read backwards from index N!",
    formula: "buckets[freq].push(num)",
    tag: "Linear Time Sort"
  },
  38: {
    num: 38,
    title: "Daily Temperatures",
    pattern: "Monotonic Decreasing Stack",
    complexity: "O(N) Time, O(N) Space",
    fact: "Store day indices in a monotonic decreasing stack. When a warmer temperature appears, pop cooler days and record the difference `currDay - prevDay`!",
    formula: "ans[prevDay] = currDay - prevDay",
    tag: "Monotonic Stack"
  },
  39: {
    num: 39,
    title: "Largest Rectangle in Histogram",
    pattern: "Monotonic Increasing Stack",
    complexity: "O(N) Time, O(N) Space",
    fact: "Every bar could be the shortest bar in a maximal rectangle! Use a monotonic stack to find the first smaller bar to the left and right in O(1) amortized time per bar.",
    formula: "area = height * (rightIndex - leftIndex - 1)",
    tag: "Hard Classic"
  },
  40: {
    num: 40,
    title: "Maximal Rectangle in 2D Binary Matrix",
    pattern: "Row Histogram Reduction",
    complexity: "O(M * N) Time, O(N) Space",
    fact: "Transform 2D matrix into 1D histograms! For each row, treat contiguous '1's as bar heights `h[j] = (val === '1' ? h[j] + 1 : 0)`. Then solve Largest Rectangle per row!",
    formula: "heights[j] = cell === '1' ? heights[j] + 1 : 0",
    tag: "Matrix to 1D"
  },
  41: {
    num: 41,
    title: "Contiguous Array (Equal 0s and 1s)",
    pattern: "Zero Transformation + Prefix Sum",
    complexity: "O(N) Time, O(N) Space",
    fact: "Transform all 0s into -1s! Now finding equal numbers of 0s and 1s equals finding the longest subarray with sum 0. Use a prefix sum hash map to find matching indices.",
    formula: "treat 0 as -1 -> find sum === 0",
    tag: "Value Transform"
  },
  42: {
    num: 42,
    title: "Continuous Subarray Sum (Multiple of K)",
    pattern: "Modulo Arithmetic Prefix Hash",
    complexity: "O(N) Time, O(K) Space",
    fact: "If `prefixSum[j] % K == prefixSum[i] % K` and `j - i >= 2`, the sum between i and j is an exact multiple of K! Store first occurrence of each remainder.",
    formula: "rem = (runningSum % k + k) % k",
    tag: "Modular Math"
  },
  43: {
    num: 43,
    title: "Subarray with Given XOR",
    pattern: "Prefix XOR Hash Map",
    complexity: "O(N) Time, O(N) Space",
    fact: "XOR has self-inverse property: `A ^ B = C <=> A ^ C = B`. If prefix XOR up to index j is `X` and target is `K`, we need a prior prefix XOR equal to `X ^ K`!",
    formula: "targetPrefix = currXOR ^ K",
    tag: "Bitwise XOR"
  },
  44: {
    num: 44,
    title: "Count Inversions in an Array",
    pattern: "Modified Merge Sort",
    complexity: "O(N log N) Time, O(N) Space",
    fact: "An inversion is `i < j` where `arr[i] > arr[j]`. During the merge step of Merge Sort, if `left[i] > right[j]`, then `left[i]` and ALL remaining elements in left are inversions!",
    formula: "inversions += (mid - i + 1)",
    tag: "Merge Sort Power"
  },
  45: {
    num: 45,
    title: "Reverse Pairs (LeetCode #493)",
    pattern: "Divide & Conquer Two Pointers",
    complexity: "O(N log N) Time, O(N) Space",
    fact: "Find pairs where `nums[i] > 2 * nums[j]` and `i < j`. During Merge Sort, before merging sorted left and right halves, run a linear two-pointer scan across both halves!",
    formula: "while (j <= right && nums[i] > 2 * nums[j]) j++",
    tag: "Hard Divide & Conquer"
  },
  46: {
    num: 46,
    title: "Best Time to Buy and Sell Stock I",
    pattern: "One-Pass Minimum Valley",
    complexity: "O(N) Time, O(1) Space",
    fact: "Track `minPrice = min(minPrice, price)` and calculate potential profit `price - minPrice` at every step. Maximize profit in a single linear scan O(N)!",
    formula: "maxProfit = Math.max(maxProfit, price - minPrice)",
    tag: "Stock Master"
  },
  47: {
    num: 47,
    title: "Best Time to Buy and Sell Stock II",
    pattern: "Greedy Slope Summation",
    complexity: "O(N) Time, O(1) Space",
    fact: "You can make multiple transactions! Simply capture every single positive upward slope: whenever `prices[i] > prices[i-1]`, add `prices[i] - prices[i-1]` to profit.",
    formula: "profit += Math.max(0, prices[i] - prices[i - 1])",
    tag: "Greedy Gains"
  },
  48: {
    num: 48,
    title: "Stock with Cooldown (State Machine DP)",
    pattern: "Finite State Machine",
    complexity: "O(N) Time, O(1) Space",
    fact: "Model 3 states: `Hold`, `Sold`, `Rest`. Transitions: `Hold = max(Hold, Rest - price)`, `Sold = Hold + price`, `Rest = max(Rest, Sold_prev)`. No large DP table needed!",
    formula: "Hold -> Sold -> Rest -> Hold",
    tag: "State Machine"
  },
  49: {
    num: 49,
    title: "Wiggle Sort (Zig-Zag Reordering)",
    pattern: "Local Swap Property",
    complexity: "O(N) Time, O(1) Space",
    fact: "Reorder so `nums[0] <= nums[1] >= nums[2] <= nums[3]...`. Check adjacent pairs in one pass: if parity of index doesn't match relation, swap with predecessor!",
    formula: "swap if (i%2 === 1 && a[i] < a[i-1])",
    tag: "Local Invariant"
  },
  50: {
    num: 50,
    title: "H-Index (Bucket Sort Linear Time)",
    pattern: "Citation Bucketing",
    complexity: "O(N) Time, O(N) Space",
    fact: "An author has index H if H papers have >= H citations. Create array `papers[citations]`. Cap citations > N at bucket N. Scan backwards accumulating count >= H!",
    formula: "if (totalPapers >= h) return h",
    tag: "Bucket Counting"
  },
  51: {
    num: 51,
    title: "Maximum Points from Cards",
    pattern: "Circular Complementary Sliding Window",
    complexity: "O(N) Time, O(1) Space",
    fact: "Picking K cards from either end is identical to leaving a contiguous subarray of size `N - K` in the middle! Minimize the sum of the middle window to maximize your score.",
    formula: "maxScore = totalSum - minSubarraySum(n - k)",
    tag: "Complement Window"
  },
  52: {
    num: 52,
    title: "Minimum Size Subarray Sum (Target S)",
    pattern: "Dynamic Shrinking Sliding Window",
    complexity: "O(N) Time, O(1) Space",
    fact: "Expand `right` until `windowSum >= target`. Then shrink `left` as much as possible while maintaining the target, updating the minimal window length at each contraction.",
    formula: "while (sum >= target) { minLen = min(minLen, R-L+1); sum -= a[L++]; }",
    tag: "Variable Window"
  },
  53: {
    num: 53,
    title: "Longest Substring with At Most K Distinct",
    pattern: "Sliding Window Hash Map",
    complexity: "O(N) Time, O(K) Space",
    fact: "Expand right and increment character frequencies in a map. If `map.size > K`, shrink left until a character frequency drops to zero and is removed from the map.",
    formula: "while (map.size > k) { if (--map[s[L]] === 0) map.delete(s[L]); L++; }",
    tag: "Distinct Window"
  },
  54: {
    num: 54,
    title: "Permutation in String",
    pattern: "Fixed Size 26-Element Frequency Window",
    complexity: "O(N) Time, O(1) Space",
    fact: "Since alphabet has only 26 lowercase letters, compare two arrays of size 26! Slide window of length `s1.length` across `s2` maintaining a single variable `matches == 26`.",
    formula: "freq[s[R] - 'a']++; freq[s[L] - 'a']--",
    tag: "Fixed Window"
  },
  55: {
    num: 55,
    title: "Find All Anagrams in a String",
    pattern: "Rolling Frequency Counts",
    complexity: "O(N) Time, O(1) Space",
    fact: "An anagram is a permutation. Slide a fixed window of length `P` over `S`. Whenever the 26-character frequency vector of the window matches P's vector, add the start index!",
    formula: "if (arraysEqual(countP, countWin)) ans.push(L)",
    tag: "Rolling Vectors"
  },
  56: {
    num: 56,
    title: "Minimum Window Substring (LeetCode #76)",
    pattern: "Two Pointers & Required Match Counter",
    complexity: "O(N) Time, O(1) Extra Space",
    fact: "Track `have` and `need` counts. Expand right until `have == need`. Once all characters are satisfied, shrink left to minimize window while maintaining match conditions.",
    formula: "expand R -> satisfy -> shrink L -> record min",
    tag: "Hard Benchmark"
  },
  57: {
    num: 57,
    title: "Subarray Product Less Than K",
    pattern: "Sliding Window Subarray Counting",
    complexity: "O(N) Time, O(1) Space",
    fact: "For every valid window `[left .. right]` where product < K, the number of new contiguous subarrays ending at index `right` is exactly `(right - left + 1)`!",
    formula: "count += (right - left + 1)",
    tag: "Combinatorial Count"
  },
  58: {
    num: 58,
    title: "Longest Repeating Character Replacement",
    pattern: "Max Frequency in Window",
    complexity: "O(N) Time, O(1) Space",
    fact: "A window is valid if `(windowLength - maxFreq) <= K`. If invalid, simply slide the window right by incrementing both left and right (the max window length never shrinks!).",
    formula: "valid if: (R - L + 1) - maxFreq <= k",
    tag: "Max Frequency"
  },
  59: {
    num: 59,
    title: "Shortest Unsorted Continuous Subarray",
    pattern: "Extreme Value Boundary Scans",
    complexity: "O(N) Time, O(1) Space",
    fact: "Find the max from left: any number smaller than running max must be sorted -> right boundary! Find the min from right: any number larger than running min -> left boundary!",
    formula: "L = leftmost out-of-order, R = rightmost out-of-order",
    tag: "Boundary Scans"
  },
  60: {
    num: 60,
    title: "Summary Ranges",
    pattern: "Two Pointer Interval Compression",
    complexity: "O(N) Time, O(1) Space",
    fact: "Whenever consecutive elements differ by more than 1 (`nums[i+1] !== nums[i] + 1`), close the current range `start -> nums[i]` and begin a new range at `nums[i+1]`.",
    formula: "if (nums[i] + 1 !== nums[i+1]) pushRange()",
    tag: "Interval Compression"
  },
  61: {
    num: 61,
    title: "Missing Ranges",
    pattern: "Boundary Discrepancy Scanning",
    complexity: "O(N) Time, O(1) Space",
    fact: "Compare each element with `prev + 1`. If `curr - prev >= 2`, then range `[prev + 1, curr - 1]` is missing! Handle lower and upper global boundaries cleanly.",
    formula: "missing range: [prev + 1, curr - 1]",
    tag: "Boundary Scans"
  },
  62: {
    num: 62,
    title: "Rotate Array by K Steps In-Place",
    pattern: "Triple Reverse Algorithm",
    complexity: "O(N) Time, O(1) Space",
    fact: "To rotate array to right by K: 1) Reverse whole array `[0 .. N-1]`. 2) Reverse first K elements `[0 .. K-1]`. 3) Reverse remaining `[K .. N-1]`. Mind-blowing trick!",
    formula: "rev(0, n-1); rev(0, k-1); rev(k, n-1)",
    tag: "Reversal Trick"
  },
  63: {
    num: 63,
    title: "Move Zeroes In-Place",
    pattern: "Snowball Two Pointers",
    complexity: "O(N) Time, O(1) Space",
    fact: "Maintain a write pointer `lastNonZeroFoundAt = 0`. Iterate through array: whenever you see non-zero, swap with write pointer and increment it. Zeroes naturally roll to back!",
    formula: "if (nums[i] !== 0) swap(nums[i], nums[write++])",
    tag: "In-Place Compaction"
  },
  64: {
    num: 64,
    title: "Remove Duplicates from Sorted Array",
    pattern: "Fast & Slow Pointers",
    complexity: "O(N) Time, O(1) Space",
    fact: "Slow pointer tracks unique elements position. Fast pointer explores ahead. When `nums[fast] !== nums[slow]`, increment slow and copy: `nums[++slow] = nums[fast]`.",
    formula: "nums[++slow] = nums[fast]",
    tag: "Write Head"
  },
  65: {
    num: 65,
    title: "Remove Element",
    pattern: "Swap with End / Overwrite",
    complexity: "O(N) Time, O(1) Space",
    fact: "When element equals `val`, swap it with the last element and decrement array length. No need to shift all intermediate elements left O(N²)! Drops operations to minimum.",
    formula: "nums[i] = nums[--n]",
    tag: "Swap Removal"
  },
  66: {
    num: 66,
    title: "Plus One (Large Integer Addition)",
    pattern: "Ripple Carry Propagation",
    complexity: "O(N) Time, O(1) Space",
    fact: "Iterate from rightmost digit: if digit is 9, turn to 0 and propagate carry. If < 9, increment and return immediately! If all were 9s, unshift 1 to front (e.g., 999 -> 1000).",
    formula: "if (digits[i] < 9) { digits[i]++; return; }",
    tag: "Carry Propagation"
  },
  67: {
    num: 67,
    title: "Array Partition I (Pairwise Min)",
    pattern: "Greedy Sorting Pairs",
    complexity: "O(N log N) Time, O(1) Space",
    fact: "To maximize the sum of `min(ai, bi)`, sort the array and pair up adjacent elements `(a[2i], a[2i+1])`. Pairing close numbers minimizes the sacrifice on the smaller number!",
    formula: "sum += nums[2 * i]",
    tag: "Greedy Pairs"
  },
  68: {
    num: 68,
    title: "Can Place Flowers",
    pattern: "Greedy Adjacent Zero Check",
    complexity: "O(N) Time, O(1) Space",
    fact: "A plot can take a flower if `plot[i] == 0` AND both left neighbor and right neighbor are 0 (or out of bounds). Plant greedily and immediately set `plot[i] = 1`!",
    formula: "if (!left && !plot[i] && !right) { plant(); }",
    tag: "Greedy Boundary"
  },
  69: {
    num: 69,
    title: "Find Pivot Index",
    pattern: "Prefix Balance Equation",
    complexity: "O(N) Time, O(1) Space",
    fact: "Calculate `totalSum` first. As you iterate, track `leftSum`. The right sum is simply `totalSum - leftSum - nums[i]`. If `leftSum == rightSum`, you found the pivot!",
    formula: "leftSum === totalSum - leftSum - nums[i]",
    tag: "Balance Equation"
  },
  70: {
    num: 70,
    title: "Squares of a Sorted Array",
    pattern: "Two Pointers Extreme Merging",
    complexity: "O(N) Time, O(N) Space",
    fact: "Negatives square to large positives! The largest squares must be at the extreme ends (far left or far right). Compare squares at both ends and fill result backwards from index N-1.",
    formula: "result[k--] = sq(left) > sq(right) ? sq(left++) : sq(right--)",
    tag: "Extreme Pointers"
  },
  71: {
    num: 71,
    title: "Height Checker (Counting Sort)",
    pattern: "Counting Sort Frequency Array",
    complexity: "O(N) Time, O(1) Space",
    fact: "Heights are bounded between 1 and 100. Build a count array of height frequencies. Loop through original array and compare with current non-zero height bucket in O(N)!",
    formula: "count[height]++",
    tag: "Counting Sort"
  },
  72: {
    num: 72,
    title: "Duplicate Zeros In-Place",
    pattern: "Two-Pass Backward Writing",
    complexity: "O(N) Time, O(1) Space",
    fact: "Count how many zeros exist to calculate virtual expanded end. Iterate backward from original end to index 0, writing elements to shifted positions without overwriting pending data!",
    formula: "write backwards from end to avoid overwrite",
    tag: "Backward Pass"
  },
  73: {
    num: 73,
    title: "Check If N and Its Double Exist",
    pattern: "Hash Set Complements",
    complexity: "O(N) Time, O(N) Space",
    fact: "Check if `set.has(2 * num)` OR `(num % 2 === 0 && set.has(num / 2))`. Add `num` to set as you go. One single pass covers both positive and negative values cleanly.",
    formula: "seen.has(2*x) || (x%2===0 && seen.has(x/2))",
    tag: "Double Match"
  },
  74: {
    num: 74,
    title: "Valid Mountain Array",
    pattern: "Two Climbers Convergence",
    complexity: "O(N) Time, O(1) Space",
    fact: "Climb up from left while strictly increasing. Climb up from right while strictly increasing. If both climbers meet at the exact same peak index (not at edges), it is a mountain!",
    formula: "while (a[L] < a[L+1]) L++; while (a[R] < a[R-1]) R--; return L===R",
    tag: "Two Climbers"
  },
  75: {
    num: 75,
    title: "Replace Elements with Greatest on Right",
    pattern: "Backward Running Maximum",
    complexity: "O(N) Time, O(1) Space",
    fact: "Scanning left-to-right takes O(N²). But scanning right-to-left takes O(N)! Maintain `maxSoFar = -1`. Store current element temporarily, update `arr[i] = maxSoFar`, update max.",
    formula: "curr = a[i]; a[i] = maxSoFar; maxSoFar = max(maxSoFar, curr)",
    tag: "Reverse Scan"
  },
  76: {
    num: 76,
    title: "Third Maximum Number",
    pattern: "Tournament Top-3 Tracking",
    complexity: "O(N) Time, O(1) Space",
    fact: "Maintain three variables `first`, `second`, `third` initialized to `-Infinity`. In one pass, update them like Olympic medals when a strictly unique new value is encountered.",
    formula: "update Gold -> Silver -> Bronze podium",
    tag: "Podium Tracking"
  },
  77: {
    num: 77,
    title: "Disappeared Numbers in Array",
    pattern: "Sign Negation Index Mapping",
    complexity: "O(N) Time, O(1) Space",
    fact: "Array values are in range `[1..N]`. For each value `V`, flip the sign of `nums[abs(V) - 1]` to negative! Any index whose value remains positive was never visited.",
    formula: "nums[abs(x) - 1] = -abs(nums[abs(x) - 1])",
    tag: "In-Place Negation"
  },
  78: {
    num: 78,
    title: "Minimum Absolute Difference",
    pattern: "Sorting + Adjacent Scan",
    complexity: "O(N log N) Time, O(N) Space",
    fact: "The minimum absolute difference in any array is always between adjacent elements in its sorted version! Sort first, find the global min diff, then collect all matching pairs.",
    formula: "minDiff = min(minDiff, arr[i] - arr[i-1])",
    tag: "Sorted Proximity"
  },
  79: {
    num: 79,
    title: "Maximum Number of Balloons",
    pattern: "Bottleneck Frequency Counting",
    complexity: "O(N) Time, O(1) Space",
    fact: "Count occurrences of letters b, a, l, o, n. Since 'l' and 'o' appear twice in 'balloon', divide their counts by 2. The final answer is the minimum among all bottleneck letters!",
    formula: "ans = min(b, a, floor(l/2), floor(o/2), n)",
    tag: "Bottleneck Count"
  },
  80: {
    num: 80,
    title: "Defanging an IP Address (Array Buffers)",
    pattern: "Pre-allocated Memory Buffer",
    complexity: "O(N) Time, O(N) Space",
    fact: "Replacing '.' with '[.]' expands each period into 3 characters. Pre-allocate an array or string buffer of exact size `length + 2 * dots` to avoid multiple dynamic reallocations!",
    formula: "newSize = originalLen + count(dots) * 2",
    tag: "Buffer Allocation"
  },
  81: {
    num: 81,
    title: "Shuffle the Array (Interleaving In-Place)",
    pattern: "Bit Packing Two Numbers in One Slot",
    complexity: "O(N) Time, O(1) Space",
    fact: "Numbers are <= 1000 (< 10 bits). Pack `x` and `y` into a single 32-bit integer: `nums[i] |= (nums[i+n] << 10)`. In second pass, unpack using bitwise AND and right shift!",
    formula: "val = (nums[i] & 1023) | (nums[i+n] << 10)",
    tag: "Bit Packing"
  },
  82: {
    num: 82,
    title: "Kids With the Greatest Candies",
    pattern: "Single-Pass Max Finding",
    complexity: "O(N) Time, O(1) Extra Space",
    fact: "Find `maxCandies` in the array first. In the second pass, test if `candies[i] + extraCandies >= maxCandies`. A simple two-pass linear check.",
    formula: "candies[i] + extra >= maxCandies",
    tag: "Linear Max"
  },
  83: {
    num: 83,
    title: "Running Sum of 1D Array",
    pattern: "In-Place Cumulative Prefix Sum",
    complexity: "O(N) Time, O(1) Space",
    fact: "Transform array in-place: for `i` from 1 to N-1, `nums[i] += nums[i-1]`. Zero additional memory allocated; transforms input into cumulative distribution array.",
    formula: "nums[i] += nums[i - 1]",
    tag: "In-Place Accumulation"
  },
  84: {
    num: 84,
    title: "Richest Customer Wealth (Row-Wise Reduction)",
    pattern: "2D Array Row Reduction",
    complexity: "O(M * N) Time, O(1) Space",
    fact: "Row-major storage means iterating through row elements `accounts[i][j]` hits contiguous memory addresses sequentially, maximizing CPU cache line utilization!",
    formula: "wealth = sum(row); maxWealth = max(maxWealth, wealth)",
    tag: "Row-Major Memory"
  },
  85: {
    num: 85,
    title: "Number of Good Pairs",
    pattern: "Combinatorial Frequency Formula",
    complexity: "O(N) Time, O(N) Space",
    fact: "If a number appears `count` times, it forms `count * (count - 1) / 2` pairs! Count frequencies with a hash table or array, then sum up combinations in O(1) per unique value.",
    formula: "pairs = n * (n - 1) / 2",
    tag: "Combinatorics"
  },
  86: {
    num: 86,
    title: "Numbers Smaller Than Current",
    pattern: "Prefix Count Array (Counting Sort)",
    complexity: "O(N) Time, O(1) Space",
    fact: "Count frequencies of each number in range `0..100`. Then compute prefix sums of the count array: `prefix[i]` immediately tells you how many numbers are strictly smaller than `i`!",
    formula: "smallerCount = prefix[num - 1]",
    tag: "Prefix Counts"
  },
  87: {
    num: 87,
    title: "Decompress Run-Length Encoded List",
    pattern: "Dynamic Array Resizing Insight",
    complexity: "O(Total Elements) Time",
    fact: "Dynamic arrays double capacity when full (amortized O(1)), but cause memory reallocations. By summing all frequencies upfront, allocate the exact target array size in one shot!",
    formula: "totalCapacity = sum(freq[2*i])",
    tag: "Capacity Preallocation"
  },
  88: {
    num: 88,
    title: "Create Target Array in Given Order",
    pattern: "List Insertion vs Fenwick Tree",
    complexity: "O(N²) Array / O(N log N) Tree",
    fact: "Inserting at index `i` shifts all subsequent elements right O(N). For large inputs (N > 100,000), using a Binary Indexed Tree (Fenwick Tree) reduces total time to O(N log N)!",
    formula: "fenwick.update() + fenwick.query()",
    tag: "Advanced Data Structure"
  },
  89: {
    num: 89,
    title: "Count Items Matching a Rule",
    pattern: "Predicate Filtering & Cache Locality",
    complexity: "O(N) Time, O(1) Space",
    fact: "Filter arrays by checking single column index directly: determine target index (0 for type, 1 for color, 2 for name) once, then run tight inner loop avoiding string lookups.",
    formula: "col = ruleKey === 'type' ? 0 : ...",
    tag: "Column Indexing"
  },
  90: {
    num: 90,
    title: "GRAND HOUSIE: Contiguous Memory & CPU Cache",
    pattern: "The Core Nature of Arrays",
    complexity: "O(1) Random Access: Pointer Math",
    fact: "The ultimate power of Arrays in Computer Science: `arr[i] = *(arr + i * sizeof(T))`! Because memory is strictly contiguous, modern CPUs can vectorize operations with SIMD (Single Instruction Multiple Data) registers, crunching 8 to 16 numbers simultaneously per clock cycle! 🚀🎉",
    formula: "*(baseAddress + index * stride)",
    tag: "Grand Housie Ultimate"
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DSA_FACTS;
} else if (typeof window !== 'undefined') {
  window.DSA_FACTS = DSA_FACTS;
}
