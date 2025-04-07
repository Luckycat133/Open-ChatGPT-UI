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
});