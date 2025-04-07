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
});