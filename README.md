# xmtp-ping

Command to send a gm to a gm bot over XMTP and measure the time in milliseconds to receive a response. Like the ping command for XMTP instead of ICMP. Command will keep pinging until receiving "exit" or stdin closes. Will use gm.xmtp.eth as gm bot target unless overridden by GM_PEER.

Uses new ephemeral address to ping from unless PINGER_XMTP_KEY is set.

# Usage

```
GM_PEER=0xDeadBeef npx xmtp-ping

```
