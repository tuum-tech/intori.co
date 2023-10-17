import type { NextPage } from 'next'
import CredDetailsFullContentSection from '../components/credential-details/cred-details-full-content-section'
import SideNavigationMenu from '../components/side-navigation/side-navigation-menu'

const CredentialDetails: NextPage = () => {
  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu
        intoriLogoMark={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/b6ad2e3a-23f7-44b9-8705-82ab5ee5a012_1697120700882037918?Expires=-62135596800&Signature=TEJ12-QjICN9cZjuafdPJu~TgqabHU654PNYJDC-FSJFNJdZeTHtwXwGLLgsZuWIyd8-0FpvIAOsF8PfigAmpjqqGoLq8faNX-1EjtNpix2sdABFeJ3qvi2ow0Pb3A2fMpJnMfkM0CVAPpU3QsUI6K8iVfuZg2wKuI-7XzYeL~6--nwK56ld61Onwo-feNclT9pgJmPCUr9pXt0WUYmfE3E-q34gBH5FsqBemdsjv-oQpwwSoppc8AfXoPK5zZanylAcXHzswYoM~CWlaIwzT3FqoOCJx1T9DVCX0Zxt1WlKu8XRL6O2ASl0ITnveNt7YpxMa833vOXUoZBq~jb~ww__&Key-Pair-Id=K1P54FZWCHCL6J`}
        closeMenuIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/7bfc5b88-c9d8-4d0f-9d08-a48d02a53a75_1697120700882195969?Expires=-62135596800&Signature=hyNzAyiER0OD11ec5wwD5vsZFroeWCj~RW55tC6yByHpzFmn6TMASQfdW44law7ZoNWHGy~C846iQqNWS4KtH237MLr7JEtG09Pq-kAITZ4ssKWd5EohliKUbx0-UQhtvjY0Ws-tEQIip1gtqUKv5CGVTYcfPc3V5Qn-s~zRt8osjdegfyeoEq~fIlkI~x5QE1p793r420~m~97nPXD3QOnce4SvtScA8jKBc6Iy3JYKJ0aWK18JuGEt4gcNL09xtOxae3ij9qHvouDg0-KK5h0A8~aCv4LXzEwNuK-LqP-rmayqaueUKeK4J7MKDvytV44B9DaSXCqGhwS2VQJdkg__&Key-Pair-Id=K1P54FZWCHCL6J`}
        overviewIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/ea96c3fb-61c0-4a8f-9928-2759b1eaf06d_1697120700882278082?Expires=-62135596800&Signature=A75uc7b-sHnW2DcddL95b3QE2M5BgbAzA9fGm~0tKuFB8GHTpNae1rj-2nrE2Gf6-YmGmFKpaheYTkXY62Mp9KrcJtaz5XVUwn8QuHFaaWV~o6s8C1dvDCmXcjnWlP5L8j8VHLTVtzfCtCo4XTfSXay8MJ7sKgXJNAlAFXe~xdK5pQNANueyv~sLB-AvrDsjpD-HROnHqOuubMUT2n5IYxKAlElim~ann0zKbN4J2wiRQAFUqx73IKAJ24wn3j8qI7hhEi1zsgtCHarpHu8zFRxkNCqw5diYs4ET-whV~ejaKgHjtluVD6GInEfVPitz2p-LAGZHJKJTuQStjTeclA__&Key-Pair-Id=K1P54FZWCHCL6J`}
        credentialsIconContainer='/credentialsiconcontainer2.svg'
        uploadIconContainer='/uploadiconcontainer4.svg'
        settingsIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/5ac15d96-f603-41be-a2d9-095b2cacc6d5_1697120700882516183?Expires=-62135596800&Signature=nn62Me3J8FEb9Wmgfik-oIKHD3TKBhTVnT5-xi-DqAmxsMO8ucXrIO9M5g6VtjgESRDKpHbSgplDvx00WaXfKJcmJGqlg0Afo7Z2DhMCTdVDjh0-6Z4NnBCTE0~wiANA~RZqjR0SRpI2rq1jIhxsU3SIUN0~XjgPH9FoqjDW~uLVai485NAY8GWoVg5wppXOAoFhP-GwY0RBuAFx45esk2A9XNJd789GXNJsYPRxCcrfJ0pmIQ6u11u47davAMU-St4NI5E3vp0Q~2jaF9809w96lMAzWXIZJKr~dpMTVye~DkThjZCC2f2-llffORgr2virCpwQt9~Hsb6GKtQobg__&Key-Pair-Id=K1P54FZWCHCL6J`}
        logoutIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/7f3baa4c-f269-4502-bcfd-f9fcb6d3f9ab_1697120700882589402?Expires=-62135596800&Signature=YK4bjzQl2DfGqmW67S8UB~YN9OYYySDbJVglLeiA6ryj92Vl1QdAZKC1qZEm3jvCds9-FVR4-Fdh5FM5APV2S51wDNFIiXnGJ5eR6ZBK2TDDXKUM-mlPuEg9oBBJ-0tcwWsFBMJMzaRFMRiZzvL8dEdRqxxsMtrEIVgUrkuL-diJTdSMl1TbkuiUNpJtPUa3RE4YGI8DT17xjuWZCBfzb41dEjOuTMjpcILCuTCbkwECaZsLuLzeGL88g0qj3mujk3JyHSh2g3ISHrP6cveQ8T5o4JnAUTgOM11Cs0HJ4UuAFF0wDgf90-lzpPgK5zkM8a2~rBDgItbmnab1TIkr6Q__&Key-Pair-Id=K1P54FZWCHCL6J`}
      />
      <CredDetailsFullContentSection />
    </div>
  )
}

export default CredentialDetails
