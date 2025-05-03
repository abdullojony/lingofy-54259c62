
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Quiz } from '@/types/models';
import { toast } from 'sonner';

interface VideoQuizProps {
  quiz: Quiz;
  open: boolean;
  onClose: () => void;
  onComplete: (correct: boolean) => void;
}

interface FormValues {
  answer: string;
}

const VideoQuiz: React.FC<VideoQuizProps> = ({ quiz, open, onClose, onComplete }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      answer: '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    setHasSubmitted(true);
    const selectedAnswer = parseInt(values.answer);
    const isCorrect = selectedAnswer === quiz.correctAnswer;
    
    if (isCorrect) {
      toast.success("Правильный ответ! Молодец!");
    } else {
      const correctOptionText = quiz.options[quiz.correctAnswer].split(' - ')[0];
      toast.error(`Не совсем верно. Правильный ответ: ${correctOptionText}`);
    }
    
    setTimeout(() => {
      onComplete(isCorrect);
      setHasSubmitted(false);
      form.reset();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Быстрый тест!</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h2 className="text-lg font-medium mb-4">{quiz.question}</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      value={field.value}
                      className="flex flex-col space-y-3"
                      disabled={hasSubmitted}
                    >
                      {quiz.options.map((option, index) => (
                        <FormItem key={index} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-duolingo-light">
                          <FormControl>
                            <RadioGroupItem value={index.toString()} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer w-full rtl:text-right">
                            {option}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="duo-btn"
                  disabled={!form.watch("answer") || hasSubmitted}
                >
                  {hasSubmitted ? "Проверяем..." : "Отправить ответ"}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoQuiz;
