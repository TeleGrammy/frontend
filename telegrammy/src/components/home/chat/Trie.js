class TrieNode {
    constructor() {
        this.children = {}; 
        this.isEndOfWord = false; 
        this.ids = [];
    }
}


class Trie {
    constructor() {
        this.root = new TrieNode(); 
    }

 
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

    
    search(word) {
        let currentNode = this.root;
        for (const char of word) {
            if (!currentNode.children[char]) {
                return false; 
            }
            currentNode = currentNode.children[char];
        }
        return currentNode.ids;
    }

    startsWith(prefix) {
        let currentNode = this.root;
        for (const char of prefix) {
            if (!currentNode.children[char]) {
                return false; 
            }
            currentNode = currentNode.children[char];
        }

        return currentNode.ids;
    }


    delete(word, nodeID) {
        const deleteRecursive = (node, word, depth) => {
       
            node.ids = node.ids.filter(id => id !=nodeID );
            if (depth === word.length) {
   
                if (node.isEndOfWord) {
                    node.isEndOfWord = false;
                }
                
                return Object.keys(node.children).length === 0;
            }

            const char = word[depth];
            if (!node.children[char]) {
                return false; 
            }

          
            const shouldDeleteChild = deleteRecursive(node.children[char], word, depth + 1);

            if (shouldDeleteChild) {
                delete node.children[char]; 
                return Object.keys(node.children).length === 0 && !node.isEndOfWord;
            }

            return false;
        };

        deleteRecursive(this.root, word, 0);
    }
}
export default Trie;
