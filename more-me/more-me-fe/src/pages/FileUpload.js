import React from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from "@mui/system"; 
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import clsx from 'clsx'


// export type FileUploadProps = {
//     imageButton?: boolean
//     accept: string
//     hoverLabel?: string
//     dropLabel?: string
//     width?: string
//     height?: string
//     backgroundColor?: string
//     image?: {
//         url: string
//         imageStyle?: {
//             width?: string
//             height?: string
//         }
//     }
//     onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
//     onDrop: (event: React.DragEvent<HTMLElement>) => void
// }

const useStyle = styled((theme) => ({
    root: {
        cursor: 'pointer',
        textAlign: 'center',
        display: 'flex',
        '&:hover p,&:hover svg,& img': {
            opacity: 1,
        },
        '& p, svg': {
            opacity: 0.4,
        },
        '&:hover img': {
            opacity: 0.3,
        },
    },
    noMouseEvent: {
        pointerEvents: 'none',
        display: 'none'
    },
    iconText: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
    },
    hidden: {
        display: 'none',
    },
    onDragOver: {
        '& img': {
            opacity: 0.3,
        },
        '& p, svg': {
            opacity: 1,
        },
    },
}))

export const FileUpload = ({
    accept,
    imageButton = false,
    hoverLabel = 'Click or drag to upload csv file',
    dropLabel = 'Drop file here',
    width = 'auto',
    height = 'auto',
    backgroundColor = '#eff0f8',
    image: {
        url = 'FileUploadDefaultImage',
        imageStyle = {
            height: 'inherit',
        },
    } = {},
    onChange,
    onDrop,
    pd = '250px',
}) => {
    const classes = useStyle()
    const [imageUrl, setImageUrl] = React.useState(url)
    const [labelText, setLabelText] = React.useState(hoverLabel)
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [isMouseOver, setIsMouseOver] = React.useState(false)
    const stopDefaults = (e) => {
        e.stopPropagation()
        e.preventDefault()
    }
    const dragEvents = {
        onMouseEnter: () => {
            setIsMouseOver(true)
        },
        onMouseLeave: () => {
            setIsMouseOver(false)
        },
        onDragEnter: (e) => {
            stopDefaults(e)
            setIsDragOver(true)
            setLabelText(dropLabel)
        },
        onDragLeave: (e) => {
            stopDefaults(e)
            setIsDragOver(false)
            setLabelText(hoverLabel)
        },
        onDragOver: stopDefaults,
        onDrop: (e) => {
            stopDefaults(e)
            setLabelText(hoverLabel)
            setIsDragOver(false)
            if (imageButton && e.dataTransfer.files[0]) {
                setImageUrl(URL.createObjectURL(e.dataTransfer.files[0]))
            }
            onDrop(e)
        },
    }

    const handleChange = (event) => {
        if (imageButton && event.target.files[0]) {
            setImageUrl(URL.createObjectURL(event.target.files[0]))
        }

        onChange(event)
    }

    return (
        <>
            <input
                onChange={handleChange}
                // accept={accept}
                className={classes.hidden}
                id="file-upload"
                type="file"
                style={{display: 'none'}}
            />

            <label
                htmlFor="file-upload"
                {...dragEvents}
                className={'cursor-pointer text-center flex group space-x-4 items-center opacity-40 hover:opacity-100'}
            >
                <Box
                    width={width}
                    height={height}
                    bgcolor={backgroundColor}
                    className={classes.noMouseEvent}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column-reverse', 
                        textAlign: 'center',
                        padding: pd || '250px',
                        border: '1px solid hsl(0deg 0% 79.23%)'
                    }}
                >
                    {imageButton && (
                        <Box position="absolute" height={height} width={width}>
                            <img
                                alt="file upload"
                                src={imageUrl}
                                style={imageStyle}
                            />
                        </Box>
                    )}

                    {(!imageButton || isDragOver || isMouseOver) && (
                        <>
                            <Box
                                height={height}
                                width={width}
                                className={classes.iconText}
                            >
                                <CloudUploadIcon fontSize="large" />
                                <Typography>{labelText}</Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </label>
        </>
    )
}
