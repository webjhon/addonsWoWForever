# Local MCP (stdio)

Run `npm run mcp`. The process uses standard MCP JSON-RPC messages on stdin/stdout; do not send debug text on stdout.

Example Codex local configuration (adapt paths to your environment):

```toml
[mcp_servers.wow_forever_factory]
command = "node"
args = ["--experimental-strip-types", "/absolute/path/wow-addon-ai-factory/mcp/server.ts"]
```

Available interfaces: tools, resources and prompts. The server does **not** provide a network listener. For hosted or remote clients such as Work, a supported remote MCP transport and secure deployment would be a separate integration. Do not expose local files to the public internet without authentication and explicit access controls.
