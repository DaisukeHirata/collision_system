
var MinPQ = function() {

    var pq = new Array();
    var N = 0;

    // is the priority queue empty?
    var isEmpty = function() {
        return N == 0;
    };

    // Returns the number of keys on the priority queue.
    var size = function() {
        return N;
    };

    // Returns a smallest key on the priority queue.
    var min = function() {
        if (isEmpty()) throw "NoSuchElementException";
        return pq[1];
    };

    // Adds a new key to the priority queue.
    var insert = function(key) {
        // add x, and percolate it up to maintain heap invariant
        pq[++N] = key;
        swim(N);
    };

    // Removes and returns a smallest key on the priority queue.
    var delMin = function() {
        exch(1, N);
        var min = pq[N--];
        sink(1);
        pq[N+1] = null;         // avoid loitering and help with garbage collection
        return min;
    };

   /***********************************************************************
    * Helper functions to restore the heap invariant.
    **********************************************************************/
    var swim = function(k) {
        while (k > 1 && greater(Math.floor(k/2), k)) {
            exch(k, Math.floor(k/2));
            k = Math.floor(k/2);
        }
    };

    var sink = function(k) {
        while (2*k <= N) {
            var j = 2*k;
            if (j < N && greater(j, j+1)) j++;
            if (!greater(k, j)) break;
            exch(k, j);
            k = j;
        }
    };

   /***********************************************************************
    * Helper functions for compares and swaps.
    **********************************************************************/
    var greater = function(a, b) {
        a = Math.floor(a);
        b = Math.floor(b);
        return pq[a].compareTo(pq[b]) > 0;
    };

    var exch = function(i, j) {
        var swap = pq[i];
        pq[i] = pq[j];
        pq[j] = swap;
    };

    // public interface
    return {
        isEmpty : isEmpty,
        size : size,
        min : min,
        insert : insert,
        delMin : delMin,
    };
};

