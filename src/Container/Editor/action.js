export const setEditor = (editor) => {
    return {
        type: 'SET_EDITOR',
        payload: {
            editor
        }
    }
}

export const setInstances = (instances) => {
    return {
        type: 'SET_INSTANCES',
        payload: {
            instances
        }
    }
}

export const setEditorContent = (content) => {
    return {
        type: 'SET_EDITOR_CONTENT',
        payload: {
            content
        }
    }
}