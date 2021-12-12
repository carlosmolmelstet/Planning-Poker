import { Button as ChakraButton } from '@chakra-ui/react';
import { ButtonHTMLAttributes } from 'react';
import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean
};

export function Button({ isOutlined = false, ...props }: ButtonProps) {
  return (
    <ChakraButton
      colorScheme="brand"
      className={`button ${isOutlined ? 'outlined' : ''}`}
      {...props}
    />
  )
}