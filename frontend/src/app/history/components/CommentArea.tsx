'use client';

import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { type Comment, postComment } from '@/lib/match';

/** Props for {@link CommentArea}. */
export type CommentAreaProps = {
  /** The match id for the comment to post to. */
  matchId: string;
  /** The list of comments for the match. */
  comments: Comment[];
};

/** A component for commenting on matches. */
export const CommentArea = ({
  matchId,
  comments: serverComments,
}: CommentAreaProps): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [newComments, setNewComments] = useState<Comment[]>([]);
  const [info, setInfo] = useState<string>('');

  const comments = [...serverComments, ...newComments];

  const handlePost = async (): Promise<void> => {
    if (name === '') {
      setInfo('Please enter a name.');
      return;
    }
    if (message === '') {
      setInfo('Please enter a message.');
      return;
    }

    await postComment(matchId, name, message).then((comment) => {
      setInfo('Sent!');
      setNewComments((other) => [...other, comment]);
      setMessage('');
    });
  };

  return (
    <>
      {comments.length === 0 ? (
        <p>No comments. Add one!</p>
      ) : (
        comments.map(({ name, message, timestamp }) => (
          <div
            key={timestamp}
            className='flex flex-col border-l-2 border-border pl-2'
            suppressHydrationWarning
          >
            <div>
              <span className='font-semibold'>{name}</span>
              {' • '}
              <span className='text-foreground/50 font-light'>
                {formatDistanceToNow(new Date(timestamp * 1000))} ago
              </span>
            </div>
            <div className='text-wrap break-words'>{message}</div>
          </div>
        ))
      )}
      <hr />

      <div className='flex flex-col gap-2'>
        <div className='justify-between flex gap-2'>
          <Input
            placeholder='Name'
            maxLength={32}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Button onClick={handlePost} className='ml-auto'>
            Comment
          </Button>
        </div>
        <TextArea
          placeholder='Type comment here...'
          maxLength={2000}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <p className='text-sm text-muted-foreground'>{info}</p>
      </div>
    </>
  );
};
