
import { useSearchParams } from "next/navigation"


export default function MailerForm({handleSubmitEmail , refrences , styles , isLoadingBtn }){

    const searchParams = useSearchParams();

    const URLParams = new URLSearchParams(searchParams);

    const Queries = Object.fromEntries( URLParams.entries() );

    return (
        <form className={styles.form} onSubmit={handleSubmitEmail} method="post">
               { refrences.SendTo_REF && <div className={styles.formGroup}>
                    <label htmlFor="email">Send To Email:</label>
                    <input ref={refrences.SendTo_REF} type="email" id="email" name="email" required />
                </div>}
                {refrences.Subject_REF  && <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject:</label>
                    {/* if subject is Retirement Request or Edit Request we use it as defaut value  if not then let user type it's subject otherwise value attr will prevent him*/}
                    {Queries.subject && <input ref={refrences.Subject_REF} value={Queries.subject } type="text" id="subject" name="subject" required />}
                    {!Queries.subject && <input ref={refrences.Subject_REF}  type="text" id="subject" name="subject" required />}
                
                </div>}
            
                {refrences.TEXT_REF &&  <div className={styles.formGroup}>
                    <label htmlFor="message">Message:</label>
                    <textarea ref={refrences.TEXT_REF} id="message" name="message" rows="4" required></textarea>
                </div>
                }
                <button className={`${(isLoadingBtn ? "loading_btn" : "")}`} type="submit">Send</button>
        </form>
    )
}