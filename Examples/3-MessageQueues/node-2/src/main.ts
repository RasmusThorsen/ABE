import HandleMessage from './handleMessage';

main();

async function main() {
    await new HandleMessage().initialize();
}
