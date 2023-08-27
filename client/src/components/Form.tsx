import { 
    Select, 
    Input, 
    Button, 
    FormControl,
    useToast
} from '@chakra-ui/react'
import './Form.css'
import { useState } from 'react'
import React from 'react'
import axios from 'axios'

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
        axios.get('https://fungptserver.devalan.tech/customgpt?'+new URLSearchParams(
            {question: input, character: dropvalue}
        )).then((res) => {
            console.log(res?.data||"Something went wrong");
            setAnswer(res?.data||"Something went wrong");
            setLoading(false);
        }
        ).catch((err) => {
            console.log(err);
            setLoading(false);
            toast({
                title: err?.response?.data || "Internal Server Error",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        })
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
         width='60%' 
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
        </Select>
        <Input 
            value={input} 
            onChange={handleInput} 
            margin='1vh auto 4vh' 
            placeholder="Write Your Question.." 
            width='60%' 
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