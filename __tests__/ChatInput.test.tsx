import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from '../components/ChatInput';

describe('ChatInput', () => {
  it('renders correctly', () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    expect(screen.getByPlaceholderText('输入消息...')).toBeInTheDocument();
    expect(screen.getByText('发送')).toBeInTheDocument();
  });

  it('calls onSendMessage when form is submitted', () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('输入消息...');
    const button = screen.getByText('发送');
    
    fireEvent.change(input, { target: { value: '测试消息' } });
    fireEvent.click(button);
    
    expect(mockSendMessage).toHaveBeenCalledWith('测试消息');
    expect(input).toHaveValue('');
  });

  it('does not call onSendMessage when message is empty', () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const button = screen.getByText('发送');
    fireEvent.click(button);
    
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});