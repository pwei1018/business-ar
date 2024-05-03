export const useKeycloak = () => {
  const { $keycloak } = useNuxtApp()
  const { locale } = useI18n()

  function login () {
    console.log('redirect url: ', `${location.origin}/${locale.value}/accounts/choose-existing`)
    return $keycloak.login(
      {
        idpHint: 'bcsc',
        redirectUri: `${location.origin}/${locale.value}/accounts/choose-existing`
      }
    )
  }

  function logout () {
    return $keycloak.logout({
      redirectUri: `${location.origin}/${locale.value}`
    })
  }

  async function getUserProfile () {
    if ($keycloak && $keycloak.authenticated) {
      return await $keycloak.loadUserProfile()
    } else {
      return null
    }
  }

  function isAuthenticated () {
    if (!$keycloak) {
      return false
    }
    return $keycloak.authenticated
  }

  const kcUser = computed((): KCUser => {
    if ($keycloak && $keycloak.tokenParsed) {
      return {
        firstName: $keycloak.tokenParsed.firstname,
        lastName: $keycloak.tokenParsed.lastname,
        fullName: $keycloak.tokenParsed.name,
        userName: $keycloak.tokenParsed.username,
        email: $keycloak.tokenParsed.email,
        keycloakGuid: $keycloak.tokenParsed.sub || '',
        loginSource: $keycloak.tokenParsed.loginSource,
        roles: $keycloak.tokenParsed.realm_access?.roles || []
      }
    }
    return {} as KCUser
  })

  return {
    login,
    logout,
    getUserProfile,
    isAuthenticated,
    kcUser
  }
}