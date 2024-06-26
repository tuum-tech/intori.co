import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Switch } from '../common/Switch'

export const SwitchAutoPublish: React.FC = () => {
  const [settings, setSettings] = useState({ autoPublish: false })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings')
        setSettings(response.data)
      } catch (err) {
        toast.error('Failed to fetch your auto publish settings. Please try again later.')
      }
    }
    fetchSettings()
  }, [])

  const onChange = useCallback(async (checked: boolean) => {
    try {
      await axios.put(
        '/api/settings',
        { autoPublish: checked }
      )

      setSettings({ autoPublish: checked })
      toast.success('Settings saved.')
    } catch (err) {
      toast.error('Failed to change your auto publish settings. Please try again later.')
      setSettings({ autoPublish: !checked })
    }
  }, [])

  const note = useMemo(() => {
    if (settings.autoPublish) {
      return 'We will publish your responses on Base with our address.'
    }

    return '(Default) Use your verified wallet address to publish your answers to Base.'
  }, [settings])

  return (
    <Switch
      name="autoPublish"
      label="Automatically publish my responses"
      checked={settings.autoPublish}
      onChange={onChange}
      note={note}
    />
  )
}

