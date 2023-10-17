import type { NextPage } from "next";
import SideNavigationMenu from "../components/side-navigation-menu";
import CredentialsFullContentSection from "../components/credentials-full-content-section";

const Credentials: NextPage = () => {
  return (
    <div className="relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start">
      <SideNavigationMenu
        intoriLogoMark={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/0f5bae8b-f818-4588-93c0-b0d757e78351_1697120683052066000?Expires=-62135596800&Signature=fbRCkqV9-rJM6GYC-2PidSreMfGqx0Hv-NYB~Y-BY67uYiKtyimJcHi1cvUvW8J1m7n9iDu62X8HQHJFGaPc-34suGvTpN5-opLMrmXgWX9Aka9H9oj2MGn4~JFJCP0dDH0wsMfUMfyhQr~N4hyevzBtvIoUANT6XP7uNMkxxZNdiccRkBiD3UrCJuCDtg9aC3UwxW0G1OlhKXSZB9Rkr02i8WmF~fnvvNgpGwxDj5lkiiCTKPevdTdA5-ZrbFlJGBaNM7hOO~wP-ytQ1eKHtrHEk-D5se0Gav0O0AvztjtK4SGbgOCYhR3jVFDGXzuhQ2u6wm~9l1aqEqega7EOfg__&Key-Pair-Id=K1P54FZWCHCL6J`}
        closeMenuIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/737304e1-8d9d-456a-9db5-da44e26e46e6_1697120683052262613?Expires=-62135596800&Signature=GBI-bHbcoesF4RXx4xY~8kc4x2vIZmuT23giVUeScIqGhLZvVPRwJc8t8qqvT-DW2gD10Du~yQT5xLYi5~I4ta8q~~PzVbpq0JA-VjVV0CWo5ziaUhKCw2uEawHwtHwZh~0D~JGLF-1AZC10anoWs7mLTshFa4-PdQy8p3v05SD9~w9HjHfx38RhFQO~udAQ4RdV~m6GsyKClV-63z-zSZomRvIl0bDfyB5zj3lXce9o0k~PryHquLLwpIiKHzZXddsL28OkXduxiUAPDSTqf7MTutOAYNKJpNQwbOY8AZq8L9orDofxwmOsiJlc8ENS9dKjKSN2a6acg2n3XjGBJg__&Key-Pair-Id=K1P54FZWCHCL6J`}
        overviewIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/72e6105d-2467-417b-a6ba-4490843503ad_1697120683052374113?Expires=-62135596800&Signature=BdjET-0OT8U-nqL~HLu800Kz~oHCcItEWigF4DnaClrgrsrin3giDXYE8xBp-avT~YPjEsS6aBYv5Qy9r6jbNXx~492R6TvAnK8Vq8JdYfwInxR8zEwFhQXdmA-DEo7Pczhk3sLrW6dBiHYJ20yVvGLm~1sr7pzTU8rsRss5aNOHfqq6gXvwafCyzeqImEML9zn0w3WAQoBq9t25HoAwnFHpBxFvxyJdrTJXbzNLEIYkSvuLd2TvyzBTW~JdcjNI7DHrTQbfF3d9RT0r4A-xlXvx2PxVOdrOnt2IzHQUh4ktEO0Y86aJjVG4SVs-GowuX7~VXXFxBjmv~fLjBuWQzA__&Key-Pair-Id=K1P54FZWCHCL6J`}
        credentialsIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/13dea291-d92d-4653-84b6-6633e9857d27_1697120683052466503?Expires=-62135596800&Signature=TdkB0nsdey-Lojd3TEE5XqDYvKGBshSQyUIdJYrnBA1JThPpI0HwOvxAU86JA1BXWGYhkWAqQwCfc~Kd8i89OPw1fApInZ72-6iizPnN~acWS4dvtjjb36b~JrkgcoqnPseXQDIMeUXNwyKoiZAtAckjvMN4~RRGUkPZzwHGdguFiR8EIuJZz46j5bCt-zzTQJt1mv3RQFKGRMlbtSH4wKzNVnyMI3CzMtEZL7gcXjCLjiRYoWCDmvx93GF3y-MFHuz9edH9O5u8CX3tNsc88GpZql-QDJ-RFq5LOU8kHIqPoaQKQqd343T2nY7Xl8eCSdXgBE2rzbs7fOHmqoOSuw__&Key-Pair-Id=K1P54FZWCHCL6J`}
        uploadIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/f62f93d4-3917-4d8c-99a6-c06ee4dc63e2_1697120683052562023?Expires=-62135596800&Signature=M7anIlNtyAgsozzUB82WuHZoaMDyY3TSkE6CZTT6nLvumsia06g3PzhPzKJf-7kT7Kf1GjGZdOvtCTJSG6-AifYjV56IrG~~1ZUY9gqFN~wbZMVBW46Oy~Scnl6Kf2Hz6x8iLXehwjvUCxaTqw3Os3fdKTorZDg24Ajd-k905IXOj4rPQQbTfzKqxYKC-oQv2QELu3E12tv4iaLAjlOe5VM1CiItrmJiXSgehcrEOel8TRrbtjzXWfRidnDaiAPQ9ZngVJYTv4lI8t1l~N-OUPu~IdPhQMxB7h9rMhoeXEfRwe71iJSNYjMpR2g8AGoKvlzvpFNZDVEzdqZqfRq2vA__&Key-Pair-Id=K1P54FZWCHCL6J`}
        settingsIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/8667a8e7-9a3e-4246-b6ba-96a03d9f91ce_1697120683052647653?Expires=-62135596800&Signature=WJX3CLrkzTRVZKKhKxdCWkKulcusMKq7MykjOYwJTF-qBFUUKOLHAArfl7bFgfXTCLwoZMiYIeLj~w371Md7aAtcVjk7Jj6AUAtyi~knCP32ldpI1Aslzi4YmuD1QZneBN1o1Cym6rt24NGzTd6rkHtUhuwbyJPGjmGYXwNThoX9wuC7XwwgUpqKwbR0us73e5jXfE1uAXANontcd-u-d7-u7Ti0rjW3H2ylMNnWUbtCPTRF2jt8L637gdh4Ck455fYfXh~dWBVrjSzijbk7JJm9tBO3ltpm5KktdkCQflMl4r2mLjqSnhn0VikcxcYSjaE2wKM3J~xk-gKOQxZu~Q__&Key-Pair-Id=K1P54FZWCHCL6J`}
        logoutIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/1f982845-4bc7-4087-95f7-54406d22cd37_1697120683052738179?Expires=-62135596800&Signature=fmgDXeQ~nq0BGG7~306ucVHxYkFcxuG45O0l8oD6Kd2QiBq0HkNQayEfbIPThUgRwmtAHU8tDEBuJkwyQQ3~rmCGuvw43p2lWgKflU9IN2OkUVH4iYNVRmtlcysK51k6TkflIvaA3LFoG49Pr9956O-FfkIxNyZ9QxdWRhmJwBjtr-EDP76nrRdxEqXlp-~74jSlP3gJtV1LdUYMB0SwcF1c60BhFS36t4EWDLp5OImEP0OZecrnLCG4lj3FhLlCmbGwICkGaOeOEeM22s6Mr5ENZ7OgotVjJQG20e21MNWY2eeE-EB2GYU5iiE3e~u10SAYvwsCHHViY-FJ4s7AVg__&Key-Pair-Id=K1P54FZWCHCL6J`}
      />
      <CredentialsFullContentSection />
    </div>
  );
};

export default Credentials;
