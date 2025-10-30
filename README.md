# Honkit Plugin Highlight Plus

Enhanced syntax highlighting plugin for Honkit with custom language and theme support.

## Installation

```bash
npm install --save honkit-plugin-highlight-plus highlight.js
honkit install
```

## Configuration

Add to your `book.json`:

```json
{
  "plugins": ["highlight-plus"],
  "pluginsConfig": {
    "highlight-plus": {
      "theme": "atom-one-dark",
      "lineNumbers": true,
      "languages": ["terraform", "dockerfile", "hcl"]
    }
  }
}
```

## Example

\`\`\`hcl
resource "aws_s3_bucket" "example" {
bucket = "my-bucket"
acl = "private"
}
\`\`\`
