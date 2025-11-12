export const useUserAvatar = () => {
  const avatarUrl = useState<string>('userAvatarUrl', () => '')

  const updateAvatar = (newUrl: string) => {
    avatarUrl.value = newUrl
  }

  return {
    avatarUrl,
    updateAvatar
  }
}
