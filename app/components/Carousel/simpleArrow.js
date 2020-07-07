export default () => ({
    root: {
        borderRadius: '50%',
        border: '1px solid',
        width: 40,
        minWidth: 40,
        height: 40,
        '& $label': {
            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
        },
        '&:hover': {
            '& $label': {
                transform: 'scale(1.3)',

            },
        },
    },
    label: {},
});
