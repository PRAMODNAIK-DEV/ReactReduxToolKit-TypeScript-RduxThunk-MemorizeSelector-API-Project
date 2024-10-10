import React, { FC } from 'react'

interface MovieCardProps {
    id:  number;
    title: string;
    body: string;
}

const MovieCard: FC<MovieCardProps> = (props) => {
    const {id, title, body} = props;

    return (
    <div className='max-w-sm bg-white max-auto rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700'>
        <h1>
            {id} - {title}
        </h1>
        <p>{body}</p>
    </div>
  )
}

export default MovieCard