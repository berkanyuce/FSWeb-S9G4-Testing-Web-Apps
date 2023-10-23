import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';
import { wait } from '@testing-library/user-event/dist/utils';

beforeEach(() => {
    render(<IletisimFormu/>);
})

test('hata olmadan render ediliyor', () => {
    expect(screen.getByText("İletişim Formu")).toBeVisible();
    expect(screen.getByRole("heading", { level : 1 })).toBeInTheDocument()
});

test('iletişim formu headerı render ediliyor', () => {
    expect(screen.getByRole("heading", { level : 1 })).toBeInTheDocument()
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    const adInput = screen.getByLabelText("Ad*");
    userEvent.type(adInput, "test")

    await waitFor(() => {
        const errors = screen.getAllByTestId("error")
        expect(errors).toHaveLength(1)
    })
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    const submitBtn = screen.getByRole("button", { name: /Gönder/i })
    userEvent.click(submitBtn)

    await waitFor(() => {
        expect(screen.getAllByTestId("error")).toHaveLength(3)
    })
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    const adInput = screen.getByLabelText("Ad*");
    userEvent.type(adInput, "abcde")

    const soyadInput = screen.getByPlaceholderText("Mansız");
    userEvent.type(soyadInput, "x")

    const submitBtn = screen.getByRole("button", { name: /Gönder/i })
    userEvent.click(submitBtn)

    await waitFor(() => {
        expect(screen.getAllByTestId("error")).toHaveLength(1)
    })
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
    userEvent.type(emailInput, "abcde.com")

    const mesajEmailHata = new RegExp(
        "email geçerli bir email adresi olmalıdır.", 
        "i"
    )
    await waitFor(() => {
        expect(screen.getByText(mesajEmailHata)).toBeInTheDocument()
    })
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    const adInput = screen.getByLabelText("Ad*");
    userEvent.type(adInput, "abcde")

    const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
    userEvent.type(emailInput, "berkan@hotmail.com")

    const submitBtn = screen.getByRole("button", { name: /Gönder/i })
    userEvent.click(submitBtn)

    await waitFor(() => {
        expect(screen.getAllByTestId("error")).toHaveLength(1)
    })    
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    const adInput = screen.getByLabelText("Ad*");
    userEvent.type(adInput, "abcde")

    const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
    userEvent.type(emailInput, "berkan@hotmail.com")

    const soyadInput = screen.getByPlaceholderText("Mansız");
    userEvent.type(soyadInput, "x")

    const submitBtn = screen.getByRole("button", { name: /Gönder/i })
    userEvent.click(submitBtn)

    await waitFor(() => {
        expect(screen.queryAllByTestId("error")).toHaveLength(0)
    })  ;  
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    const adInput = screen.getByLabelText("Ad*");
    userEvent.type(adInput, "abcde")

    const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
    userEvent.type(emailInput, "berkan@hotmail.com")

    const soyadInput = screen.getByPlaceholderText("Mansız");
    userEvent.type(soyadInput, "x")

    const mesajInput = screen.getByLabelText("Mesaj")
    userEvent.type(mesajInput, "abcde")

    const formElement = screen.getByTestId("form")

    await waitFor(() => {
        expect(formElement).toHaveFormValues({
            ad: "abcde",
            soyad: "x",
            email : "berkan@hotmail.com",
            mesaj : "abcde",
        })
    })

    await waitFor(() => {
        const submitBtn = screen.getByRole("button", { name: /Gönder/i })
        userEvent.click(submitBtn)

        expect(screen.getByTestId("firstnameDisplay")).toHaveTextContent("abcde")
        expect(screen.getByTestId("lastnameDisplay")).toHaveTextContent("x")
        expect(screen.getByTestId("emailDisplay")).toHaveTextContent("berkan@hotmail.com")
        expect(screen.getByTestId("messageDisplay")).toHaveTextContent("abcde")
    })
    

});
