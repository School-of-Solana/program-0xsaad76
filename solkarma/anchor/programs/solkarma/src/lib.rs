use anchor_lang::prelude::*;

declare_id!("AxLm6hUXXZMoemQaXEKWcdkcXKAKHk4iVcxLsoEWARDS");

#[program]
pub mod solkarma {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn submit_review(ctx: Context<SubmitReview>, target: Pubkey, message: String, rating: u8) -> Result<()> {
        msg!("Review Created Succesfuly !");
        msg!("reviewer : {}", ctx.accounts.user.key());
        msg!("Target : {}", target);
        msg!("Rating : {}", rating);
        msg!("Message : {}", &message);

        let review_account = &mut ctx.accounts.review_account;
        review_account.reviewer = ctx.accounts.user.key();
        review_account.target = target;
        review_account.rating = rating;
        review_account.message = message;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
#[instruction(target: Pubkey, message: String, rating: u8)]
pub struct SubmitReview<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK : safe because we only send money to it & we don't read its data.
    #[account(mut)]
    pub target_account: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserProfile::INIT_SPACE,
        seeds = [b"profile", target_account.key().as_ref()],
        bump
    )]
    pub target_profile: Account<'info, UserProfile>,
    #[account(
        init,
        payer = user,
        seeds = [b"review", user.key().as_ref(), target.key().as_ref()],
        bump,
        space = 8 + ReviewAccount::INIT_SPACE
    )]
    pub review_account: Account<'info, ReviewAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct UserProfile {
    pub review_count: u64,
    pub total_stars: u64,
}

#[account]
#[derive(InitSpace)]
pub struct ReviewAccount {
    target: Pubkey,
    reviewer: Pubkey,
    rating: u8,
    #[max_len(200)]
    message: String,
}
