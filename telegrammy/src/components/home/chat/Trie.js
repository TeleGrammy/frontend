class TrieNode {
    constructor() {
        this.children = {}; // Object to store child nodes
        this.isEndOfWord = false; // True if the node marks the end of a word
        this.ids = [];
    }
}

// Trie data structure
class Trie {
    constructor() {
        this.root = new TrieNode(); // Root node of the Trie
    }

    // Insert a word into the Trie
    insert(word, id) {
        let currentNode = this.root;
        for (const char of word) {
            if (!currentNode.children[char]) {
                currentNode.children[char] = new TrieNode();
            }
            currentNode.ids = [...currentNode.ids, id];
            currentNode = currentNode.children[char];
            
        }
        currentNode.isEndOfWord = true;
        currentNode.ids = [...currentNode.ids, id];
    }

    // Search for a word in the Trie
    search(word) {
        let currentNode = this.root;
        for (const char of word) {
            if (!currentNode.children[char]) {
                return false; // Word not found
            }
            currentNode = currentNode.children[char];
        }
        return currentNode.ids;
    }

    // Check if any word in the Trie starts with the given prefix
    startsWith(prefix) {
        let currentNode = this.root;
        for (const char of prefix) {
            if (!currentNode.children[char]) {
                return false; // Prefix not found
            }
            currentNode = currentNode.children[char];
        }

        return currentNode.ids;
    }

    // Delete a word from the Trie
    delete(word, nodeID) {
        const deleteRecursive = (node, word, depth) => {
            // Base case: If we've traversed all characters of the word
            node.ids = node.ids.filter(id => id !=nodeID );
            if (depth === word.length) {
                // Mark the end of the word as false
                if (node.isEndOfWord) {
                    node.isEndOfWord = false;
                }

               
                // If the node has no children, it's safe to delete
                return Object.keys(node.children).length === 0;
            }

            const char = word[depth];
            if (!node.children[char]) {
                return false; // Word not found
            }

            // Recursively delete the child node
            const shouldDeleteChild = deleteRecursive(node.children[char], word, depth + 1);

            if (shouldDeleteChild) {
                delete node.children[char]; // Remove the child reference
                // Return true if no children are left and it's not the end of another word
                return Object.keys(node.children).length === 0 && !node.isEndOfWord;
            }

            return false;
        };

        deleteRecursive(this.root, word, 0);
    }
}
export default Trie;
