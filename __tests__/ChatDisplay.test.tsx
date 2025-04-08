import { render, screen } from '@testing-library/react';
import ChatDisplay from '../components/ChatDisplay';
import { Message } from '../types';

describe('ChatDisplay', () => {
  it('renders empty state correctly', () => {
    render(<ChatDisplay messages={[]} />);
    expect(screen.queryByTestId('message-list')).toBeEmptyDOMElement();
  });

  it('renders messages correctly', () => {
    const testMessages: Message[] = [
      {
        role: 'user',
        content: '测试消息1',
        timestamp: Date.now()
      },
      {
        role: 'assistant',
        content: '测试回复1',
        timestamp: Date.now() + 1000
      }
    ];
    
    render(<ChatDisplay messages={testMessages} />);
    
    expect(screen.getByText('测试消息1')).toBeInTheDocument();
    expect(screen.getByText('测试回复1')).toBeInTheDocument();
    expect(screen.getAllByTestId('message-item')).toHaveLength(2);
  });

  it('renders markdown content correctly for assistant messages', () => {
    const markdownMessage: Message[] = [
      {
        role: 'assistant',
        content: '# 标题\n- 列表项1\n- 列表项2',
        timestamp: Date.now()
      }
    ];

    render(<ChatDisplay messages={markdownMessage} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('标题');
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent('列表项1');
    expect(listItems[1]).toHaveTextContent('列表项2');
  });

  it('applies correct styling for user and assistant messages', () => {
    const testMessages: Message[] = [
      {
        role: 'user',
        content: '用户消息',
        timestamp: Date.now()
      },
      {
        role: 'assistant',
        content: '助手消息',
        timestamp: Date.now() + 1000
      }
    ];

    render(<ChatDisplay messages={testMessages} />);

    const userMessage = screen.getByText('用户消息').parentElement;
    const assistantMessage = screen.getByText('助手消息').parentElement;

    expect(userMessage).toHaveClass('bg-blue-500');
    expect(userMessage).toHaveClass('text-white');
    expect(assistantMessage).toHaveClass('bg-gray-200');
    expect(assistantMessage).toHaveClass('text-gray-800');
  });

  it('handles long messages without breaking layout', () => {
    const longMessage: Message[] = [
      {
        role: 'user',
        content: '这是一个非常长的消息'.repeat(50),
        timestamp: Date.now()
      }
    ];

    render(<ChatDisplay messages={longMessage} />);
    const messageContainer = screen.getByText(/这是一个非常长的消息/).parentElement;
    expect(messageContainer).toHaveClass('max-w-3/4');
  });

  it('sorts messages by timestamp', () => {
    const messages: Message[] = [
      {
        role: 'user',
        content: '第二条消息',
        timestamp: Date.now() + 1000
      },
      {
        role: 'user',
        content: '第一条消息',
        timestamp: Date.now()
      }
    ];

    render(<ChatDisplay messages={messages} />);
    const messageElements = screen.getAllByTestId('message-item');
    expect(messageElements[0]).toHaveTextContent('第一条消息');
    expect(messageElements[1]).toHaveTextContent('第二条消息');
  });

  it('handles messages with code blocks', () => {
    const codeMessage: Message[] = [
      {
        role: 'assistant',
        content: '```javascript\nconst hello = "world";\nconsole.log(hello);\n```',
        timestamp: Date.now()
      }
    ];

    render(<ChatDisplay messages={codeMessage} />);
    const codeBlock = screen.getByTestId('message-item');
    expect(codeBlock).toHaveTextContent('const hello = "world"');
    expect(codeBlock).toHaveTextContent('console.log(hello);');
  });

  it('handles messages with mixed content types', () => {
    const mixedMessage: Message[] = [
      {
        role: 'assistant',
        content: '# 标题\n普通文本\n```code```\n- 列表项',
        timestamp: Date.now()
      }
    ];

    render(<ChatDisplay messages={mixedMessage} />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByText('普通文本')).toBeInTheDocument();
    expect(screen.getByText('code')).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('handles error state gracefully', () => {
    const invalidMessage: Message[] = [
      {
        role: 'invalid-role' as any,
        content: '错误消息',
        timestamp: Date.now()
      }
    ];

    render(<ChatDisplay messages={invalidMessage} />);
    expect(screen.getByTestId('message-list')).toBeInTheDocument();
  });
});