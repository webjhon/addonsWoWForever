import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from '../src/core.ts';
import {dispatch} from '../mcp/server.ts';
test('MCP initialize/list/read and capabilities',async()=>{
 const init=await dispatch({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-06-18'}});
 assert.equal(init.result.serverInfo.name,'wow-forever-alliance-factory');
 const tools=await dispatch({jsonrpc:'2.0',id:2,method:'tools/list'});assert.ok(tools.result.tools.length>=8);
 const scope=await dispatch({jsonrpc:'2.0',id:3,method:'resources/read',params:{uri:'factory://scope'}});assert.match(scope.result.contents[0].text,/Alliance/);
 const c=await dispatch({jsonrpc:'2.0',id:4,method:'tools/call',params:{name:'check_client_capability',arguments:{id:'not-confirmed'}}});
 assert.match(c.result.content[0].text,/UNVERIFIED/);
});
test('benchmark coverage and original icon exist',()=>{
 const benchmark=JSON.parse(fs.readFileSync(path.join(ROOT,'evals/benchmarks/scenarios.json'),'utf8'));
 assert.equal(benchmark.length,12);assert.ok(fs.statSync(path.join(ROOT,'design-system/assets/AllianceCompass.tga')).size>5000);
});
