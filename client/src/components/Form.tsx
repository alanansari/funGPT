import { 
    Select, 
    Input, 
    Button, 
    FormControl,
    useToast
} from '@chakra-ui/react'
import './Form.css'
import React, { useState } from 'react'

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

    const handleSubmit = () => {
        setLoading(true);
        setAnswer('');

        const sse = new EventSource('https://fungptserver.devalan.tech/customgpt?'+new URLSearchParams(
            {question: input, character: dropvalue}
        ));

        sse.onopen = (e) => {
            console.log(e);
        }

        sse.onmessage = (e) => {
            const data = e.data;
            if(data === 'END'){
                setLoading(false);
                sse.close();
                return;
            }
            setAnswer(prevAnswer => prevAnswer + data);
        }

        sse.onerror = (e) => {
            console.log(e);
            setLoading(false);
            toast({
                title: "Error",
                description: "Too many requests, please try again later",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            sse.close();
        }
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
            <option value="yoda">Yoda</option>
            <option value="winny the pooh">Winny The Pooh</option>
            <option value="kermit the frog">Kermit The Frog</option>
            <option value="voldemort">Voldemort</option>
            <option value="quagmire">Glenn Quagmire</option>
            <option value="madara">Madara Uchiha</option>
            <option value="rick sanchez">Rick Sanchez</option>
            <option value="michael scott">Michael Scott</option>
            <option value="hulk">Hulk</option>
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