export default interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
