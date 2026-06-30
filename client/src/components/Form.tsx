import { 
    Select, 
    Input, 
    Button, 
    FormControl,
    useToast
} from '@chakra-ui/react'
import './Form.css'
import React, { useState } from 'react'
import characters from '../characters.json'

const Form = () => {

    const [input, setInput] = useState('');
    const [dropvalue, setDropvalue] = useState('');
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const toast = useToast();
    

    const isError = input === '';
    const isDropError = dropvalue === '';

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }

    const handleDrop = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDropvalue(e.target.value);
    }

    const showError = (description: string) => {
        toast({
            title: "Error",
            description,
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    };

    const handleSubmit = () => {
        const serverUrl = import.meta.env.VITE_SERVER_URL;
        if (!serverUrl) {
            showError("Server URL is not configured.");
            return;
        }

        setLoading(true);
        setAnswer('');

        const sse = new EventSource(
            serverUrl + '/customgpt?' + new URLSearchParams({ question: input, character: dropvalue })
        );

        sse.onmessage = (e) => {
            const data = e.data;
            if (data === 'END') {
                setLoading(false);
                sse.close();
                return;
            }
            setAnswer(prevAnswer => prevAnswer + data);
        };

        sse.onerror = () => {
            setLoading(false);
            sse.close();
            showError("Something went wrong. Please try again later.");
        };
    }

  return (
    <div className='container'>
    <FormControl isInvalid={isError||isDropError} className='form'>
        <div className='heading'>funGPT</div>
        <Select
         value={dropvalue}
         onChange={handleDrop}
         margin='3vh'
         placeholder="Select character" 
         width='65%' 
         size='md' 
         variant='filled'
         color='grey'
         backgroundColor='#07070770' >
            {characters.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
            ))}
        </Select>
        <Input 
            value={input} 
            onChange={handleInput} 
            margin='1vh auto 4vh' 
            placeholder="Write Your Question.." 
            width='65%' 
            size='md' 
            variant='filled'
            isRequired={true}
            color='white'
            backgroundColor='#07070770' />
        <Button isDisabled={isError||isDropError} isLoading={loading} onClick={handleSubmit} colorScheme='blue' size='md' width='40%' variant='solid' margin='4vh auto'>Ask</Button>
    </FormControl>
    <div className='answer'>{answer}</div>
    </div>
  )
}

export default Form